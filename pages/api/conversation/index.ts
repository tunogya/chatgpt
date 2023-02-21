import {NextApiRequest, NextApiResponse} from 'next';
import jwt from "jsonwebtoken";
import {ddbDocClient} from "@/utils/DynamoDB";
import {BatchWriteCommand, GetCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from 'uuid';
import {Readable} from "stream";

// export const config = {
//   runtime: "edge",
//   api: {
//     bodyParser: false,
//     responseLimit: false,
//   },
// };

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
      }));
      res.status(200).json({
        items: conversations.Items?.map((item: any) => ({
          id: item.SK,
          title: item.title,
          create_time: new Date(item.create_at * 1000).toLocaleString(),
        })),
        total: conversations.Count,
        limit,
        offset,
      });
    } else if (req.method === 'POST') {
      const {action, messages, model, parent_message_id} = req.body;
      // get user priority pass
      const user = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: user_id,
          SK: user_id,
        },
      }));
      if (!user.Item) {
        res.status(500).json({error: 'user not found'})
        return
      }
      const priority_pass = user.Item.priority_pass || 0;

      if (priority_pass < Math.floor(Date.now() / 1000)) {
        res.status(401).json({error: 'priority pass expired'})
        return
      }
      let conversation_id = req.body?.conversation_id || undefined;
      if (!conversation_id) {
        conversation_id = `CONVERSATION#${uuidv4()}`;
        try {
          await ddbDocClient.send(new PutCommand({
            TableName: 'wizardingpay',
            Item: {
              PK: user_id,
              SK: conversation_id,
              title: messages[0].content.parts[0],
              create_at: Math.floor(Date.now() / 1000),
              TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
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
                  TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
                }
              },
            }))
          }
        }));
      } catch (e) {
        res.status(500).json({error: 'failed to create conversation'})
        return
      }
      // define init prompt of openai
      let prompt = '';
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
          prompt = prompt + `${parent_message_role}: ${parent_message_content}\n`;
        } catch (e) {
          res.status(500).json({error: 'failed to create conversation'})
        }
      }
      prompt = prompt + `user: ${messages[0].content.parts[0]}\nai: `;
      /** https://platform.openai.com/docs/models/gpt-3
       text-davinci-003 max 4000 tokens, others max 2048 tokens
       **/
      let max_tokens
      if (model === 'text-davinci-003') {
        max_tokens = 4000;
      } else {
        max_tokens = 2048;
      }
      let result = await fetch('https://api.openai.com/v1/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model,
          prompt,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          presence_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          max_tokens,
          stream: true, // false is default
          n: 1,
          best_of: 1, // 1 is default
          user: user_id,
          stop: ['user:'],
        }),
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-Accel-Buffering', 'no');

      const message_id = Math.floor(Date.now() / 1000).toString();
      let full_message = '';
      const stream = result.body as any as Readable;
      stream.on('data', (chunk: any) => {
        // when chunk is [DONE], the stream is finished
        const line = chunk.toString().slice('data: '.length);
        if (line === '[DONE]\n\n') {
          res.write('data: [DONE]\n\n');
          ddbDocClient.send(new PutCommand({
            TableName: 'wizardingpay',
            Item: {
              PK: conversation_id,
              SK: message_id,
              role: 'ai',
              content: {
                type: 'text',
                parts: [full_message],
              },
              TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
              create_at: Math.floor(Date.now() / 1000),
            },
          })).then(() => {
            res.end();
          });
        } else {
          const data = JSON.parse(line);
          const part = data.choices[0].text
          // append the chunk to the full message
          full_message += part;
          res.write(`data: ${JSON.stringify({
            id: conversation_id,
            title: messages[0].content.parts[0],
            messages: [
              {
                id: message_id,
                role: 'ai',
                content: {
                  type: 'text',
                  parts: [
                    part,
                  ],
                }
              }
            ],
          })}\n\n`);
        }
      });
      stream.on('end', () => {
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
            'wizardingpay': ids.map((id: string) => ({
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