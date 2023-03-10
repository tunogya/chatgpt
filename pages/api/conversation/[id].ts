import {NextApiRequest, NextApiResponse} from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {DeleteCommand, GetCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    res.status(401).json({error: 'invalid token'})
    return
  }
  jwt.verify(accessToken, process.env.JWT_SECRET || '', async (err: any, decoded: any) => {
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
          /**
           * Response data:
           * {
           *   "title": "Hello and Assistance",
           *   "create_time": 1678466827.852352,
           *   "mapping": {
           *     "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5": {
           *       "id": "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5",
           *       "message": {
           *         "id": "e64c6238-0ae1-4d1f-8ecd-3e07a89849b5",
           *         "author": {
           *           "role": "system",
           *           "metadata": {}
           *         },
           *         "create_time": 1678466827.852352,
           *         "content": {
           *           "content_type": "text",
           *           "parts": [
           *             ""
           *           ]
           *         },
           *         "end_turn": true,
           *         "weight": 1,
           *         "metadata": {},
           *         "recipient": "all"
           *       },
           *       "parent": "91d08562-c1a2-4252-89d0-4eba985a65b6",
           *       "children": [
           *         "3fc5da70-98ab-4769-940a-13c26613b211"
           *       ]
           *     },
           *   },
           *   "moderation_results": [],
           *   "current_node": "f253c0d1-eb10-4ee4-9371-31832eae073f"
           * }
           */
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
          UpdateExpression: `SET ${UpdateExpression}`,
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