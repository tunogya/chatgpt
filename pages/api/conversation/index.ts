import {NextApiRequest, NextApiResponse} from 'next';
import jwt from "jsonwebtoken";
import {ddbDocClient} from "@/utils/DynamoDB";
import {BatchWriteCommand, GetCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {Readable} from "stream";
import uid from "@/utils/uid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get token from header authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({error: 'invalid token'})
    return
  }
  jwt.verify(token, process.env.JWT_SECRET || '', async (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({error: 'invalid token'})
      return
    }
    const user_id = decoded.id;
    if (req.method === 'GET') {
      const offset = Number(req.query?.offset || 0);
      const limit = Number(req.query?.limit || 20);
      const conversations = await ddbDocClient.send(new QueryCommand({
        TableName: 'wizardingpay',
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
        FilterExpression: '#is_visible = :is_visible',
        ExpressionAttributeNames: {
          '#pk': 'PK',
          '#sk': 'SK',
          '#is_visible': 'is_visible',
        },
        ExpressionAttributeValues: {
          ':pk': user_id,
          ':sk': 'CONVERSATION#',
          ':is_visible': true,
        },
        ScanIndexForward: false,
      }));
      res.status(200).json({
        items: conversations.Items?.map((item: any) => ({
          id: item.SK,
          title: item.title,
          create_time: new Date(item.created * 1000).toISOString(),
        })),
        total: conversations.Count,
        limit,
        offset,
      });
    } else if (req.method === 'POST') {
      const {action, messages, model, parent_message_id} = req.body;
      if (action !== 'next') {
        res.status(400).json({error: 'Currently, only next action is supported.'})
        return
      }
      // Currently, only gpt-3.5-turbo and gpt-3.5-turbo-0301 are supported.
      // https://platform.openai.com/docs/api-reference/chat
      if (model !== 'gpt-3.5-turbo' && model !== 'gpt-3.5-turbo-0301') {
        res.status(400).json({error: 'Currently, only gpt-3.5-turbo and gpt-3.5-turbo-0301 are supported.'})
        return
      }
      let conversation_id = req.body?.conversation_id || undefined;
      if (!conversation_id) {
        conversation_id = `CONVERSATION#${uid.getUniqueID().toString()}`;
        try {
          await ddbDocClient.send(new PutCommand({
            TableName: 'wizardingpay',
            Item: {
              PK: user_id,
              SK: conversation_id,
              title: messages[0].content.parts[0].slice(0, 20),
              created: Math.floor(Date.now() / 1000),
              TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
              is_visible: true,
            },
          }));
        } catch (e) {
          res.status(500).json({error: 'failed to create conversation'})
          return
        }
      }
      try {
        await ddbDocClient.send(new BatchWriteCommand({
          RequestItems: {
            'wizardingpay': messages.map((message: any) => ({
              PutRequest: {
                Item: {
                  PK: conversation_id,
                  SK: message.id,
                  role: message.role,
                  content: message.content,
                  TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
                }
              },
            }))
          }
        }));
      } catch (e) {
        res.status(500).json({error: 'failed to create conversation'})
        return
      }
      const full_messages = [] as { role: string, content: string }[];
      if (parent_message_id) {
        try {
          const parent_message = await ddbDocClient.send(new GetCommand({
            TableName: 'wizardingpay',
            Key: {
              PK: conversation_id,
              SK: parent_message_id,
            }
          }));
          const parent_message_role = parent_message.Item?.role;
          const parent_message_content = parent_message.Item?.content.parts[0];
          full_messages.push({
            role: parent_message_role,
            content: parent_message_content,
          });
        } catch (e) {
          res.status(500).json({error: 'failed to create conversation'})
        }
      }
      // put current messages to full_messages
      full_messages.push(...messages.map((message: any) => ({
          role: message.role,
          content: message.content.parts[0],
        })
      ))
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model,
          messages: full_messages,
          temperature: 1,
          top_p: 1,
          frequency_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          presence_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          stream: true, // false is default
          n: 1,
          user: user_id,
        }),
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-Accel-Buffering', 'no');

      const message_id = Math.floor(Date.now() / 1000).toString();
      let full_content = '';
      let role = 'assistant';
      const stream = result.body as any as Readable;
      stream.on('data', (chunk: any) => {
        const lines = chunk
          .toString()
          .split('\n\n')
          .filter((line: string) => line !== '')
          .map((line: string) => line.trim().replace('data: ', ''));
        for (const line of lines) {
          // when chunk is [DONE], the stream is finished
          if (line === '[DONE]') {
            res.write('data: [DONE]\n\n');
          } else {
            try {
              const data = JSON.parse(line);
              if (data.choices[0].delta?.role) {
                role = data.choices[0].delta.role;
              }
              if (!data.choices[0].delta?.content) {
                return;
              }
              const part = data.choices[0].delta.content
              full_content += part;
              res.write(`data: ${JSON.stringify({
                id: conversation_id,
                title: messages[0].content.parts[0],
                messages: [
                  {
                    id: message_id,
                    role,
                    content: {
                      type: 'text',
                      parts: [
                        part,
                      ],
                    }
                  }
                ],
              })}\n\n`);
            } catch (e) {
              console.log(`line parse error:`, line)
            }
          }
        }
      });
      stream.on('end', async () => {
        await ddbDocClient.send(new PutCommand({
          TableName: 'wizardingpay',
          Item: {
            PK: conversation_id,
            SK: message_id,
            role: role,
            content: {
              type: 'text',
              parts: [full_content],
            },
            TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
            created: Math.floor(Date.now() / 1000),
          },
        }))
        res.end();
      });
      stream.on('error', (error: any) => {
        res.end(`data: ${JSON.stringify({error})}\n\n`);
      });
    } else if (req.method === 'DELETE') {
      const {ids} = req.body;
      try {
        await ddbDocClient.send(new BatchWriteCommand({
          RequestItems: {
            'wizardingpay': ids.slice(0, 25).map((id: string) => ({
              DeleteRequest: {
                Key: {
                  PK: user_id,
                  SK: id,
                }
              }
            }))
          }
        }));
        res.status(200).json({success: true})
      } catch (e) {
        res.status(500).json({error: e})
        return
      }
    }
  })
}