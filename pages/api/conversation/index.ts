import {NextApiRequest, NextApiResponse} from 'next';
import jwt from "jsonwebtoken";
import {ddbDocClient} from "@/utils/DynamoDB";
import {BatchWriteCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from 'uuid';

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
          create_time: new Date(item.create_at * 1000).toLocaleString(),
        })),
        total: conversations.Count,
        limit,
        offset,
      });
    } else if (req.method === 'POST') {
      const {action, messages, model, parent_message_id} = req.body;
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
      let result = await fetch('https://api.openai.com/v1/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `Human: ${messages[0].content.parts[0]}\nAI: `,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          presence_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          max_tokens: 200,
          // stream: true, // false is default
          n: 1,
          best_of: 1, // 1 is default
          user: user_id,
        }),
      });
      const response = await result.json();

      res.status(200).json({
        id: conversation_id,
        title: messages[0].content.parts[0],
        messages: [
          {
            id: uuidv4(),
            role: 'ai',
            content: {
              type: 'text',
              parts: [
                response.choices[0].text,
              ],
            }
          }
        ]
      });
    }
    else if (req.method === 'DELETE') {
      const {ids} = req.body;
      console.log(ids)
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