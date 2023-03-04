import {NextApiRequest, NextApiResponse} from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {DeleteCommand, GetCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      const {id} = req.query
      try {
        const conversationRes = await ddbDocClient.send(new GetCommand({
          TableName: 'wizardingpay',
          Key: {
            PK: user_id,
            SK: `CONVERSATION#${id}`,
          },
        }))
        if (conversationRes.Item) {
          if (conversationRes.Item.is_visible === false) {
            res.status(401).json({error: 'You are not allowed to view this conversation'})
            return
          }
          const messagesRes = await ddbDocClient.send(new QueryCommand({
            TableName: 'wizardingpay',
            KeyConditionExpression: '#pk = :pk',
            ExpressionAttributeValues: {
              ':pk': conversationRes.Item.SK,
            },
            ExpressionAttributeNames: {
              '#pk': 'PK',
            },
          }))
          conversationRes.Item.messages = messagesRes.Items
          res.status(200).json(conversationRes.Item)
        } else {
          res.status(404).json({error: 'No conversation found'})
        }
      } catch (e) {
        res.status(500).json({error: 'No conversation found'})
      }
    }
    else if (req.method === 'PATCH') {
      const {id} = req.query
      const needToUpdateObject = req.body
      const UpdateExpression = Object.keys(needToUpdateObject).map(key => `#${key} = :${key}`).join(', ')
      const ExpressionAttributeNames = {}
      const ExpressionAttributeValues = {}
      Object.keys(needToUpdateObject).forEach(key => {
        // @ts-ignore
        ExpressionAttributeNames[`#${key}`] = key
        // @ts-ignore
        ExpressionAttributeValues[`:${key}`] = needToUpdateObject[key]
      })
      try {
        await ddbDocClient.send(new UpdateCommand({
          TableName: 'wizardingpay',
          Key: {
            PK: user_id,
            SK: `CONVERSATION#${id}`,
          },
          UpdateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
        }))
        res.status(200).json({success: true})
      } catch (e) {
        res.status(500).json({success: false})
      }
    }
    else if (req.method === 'DELETE') {
      const {id} = req.query
      try {
        await ddbDocClient.send(new DeleteCommand({
          TableName: 'wizardingpay',
          Key: {
            PK: user_id,
            SK: `CONVERSATION#${id}`,
          },
        }))
        res.status(200).json({success: true})
      } catch (e) {
        res.status(500).json({success: false})
      }
    }
  })
}