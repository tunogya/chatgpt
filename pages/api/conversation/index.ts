import {NextApiRequest, NextApiResponse} from 'next';
import jwt from "jsonwebtoken";
import {ddbDocClient} from "@/utils/DynamoDB";
import {BatchWriteCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from 'uuid';
import {Message} from "@/components/ConversionCell";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const offset = Number(req.query?.offset || 0);
    const limit = Number(req.query?.limit || 20);
    const token = req.headers.authorization?.split(' ')?.[1]
    if (!token) {
      res.status(401).json({error: 'invalid token'})
      return
    }
    jwt.verify(token, process.env.JWT_SECRET || '', async (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({error: 'invalid token'})
        return
      }
      const username = decoded.username;
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
          ':pk': `USER#${username}`,
          ':sk': 'CONVERSATION#',
          ':is_visible': true,
        },
      }));
      res.status(200).json({
        items: conversations.Items?.map((item: any) => ({
          id: item.SK.split('#')[1],
          title: item.title,
          create_time: item.create_time,
        })),
        total: conversations.Count,
        limit,
        offset,
      })
    })
  } else if (req.method === 'POST') {
    const {action, messages, model, parent_message_id} = req.body;
    let conversation_id = req.body?.conversation_id || undefined;

    if (!conversation_id) {
      conversation_id = uuidv4();
      try {
       await ddbDocClient.send(new PutCommand({
          TableName: 'wizardingpay',
          Item: {
            PK: `CONVERSATION#${conversation_id}`,
            SK: `CONVERSATION#${conversation_id}`,
            title: '',
            create_at: Math.floor(Date.now() / 1000),
            is_visible: true,
          }
        }))
      } catch (e) {
        res.status(500).json({error: 'failed to create conversation'})
        return
      }
    }
    try {
      await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          'wizardingpay': messages.map((message: Message) => ({
            PutRequest: {
              Item: {
                PK: `CONVERSATION#${conversation_id}`,
                SK: `MESSAGE#${message.id}`,
                role: message.role,
                content: message.content,
              }
            },
          }))
        }
      }));
    } catch (e) {
      res.status(500).json({error: 'failed to create conversation'})
      return
    }
    // return a stream
  }
}