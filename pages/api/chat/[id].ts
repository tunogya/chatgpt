import {NextApiRequest, NextApiResponse} from 'next';
import ddbDocClient from "@/utils/ddbDocClient";
import {DeleteCommand, GetCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {withApiAuthRequired, getSession} from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const {user} = await getSession(req, res);
  const user_id = user.sub;
  if (req.method === 'GET') {
    const {id} = req.query
    try {
      const {Item} = await ddbDocClient.send(new GetCommand({
        TableName: 'abandonai-prod',
        Key: {
          PK: `USER#${user_id}`,
          SK: `CHAT#${id}`,
        },
      }))
      if (Item) {
        if (Item.is_visible === false) {
          res.status(401).json({error: 'You are not allowed to view this chat'})
          return
        }
        const messagesRes = await ddbDocClient.send(new QueryCommand({
          TableName: 'abandonai-prod',
          KeyConditionExpression: '#pk = :pk',
          ExpressionAttributeValues: {
            ':pk': Item.SK,
          },
          ExpressionAttributeNames: {
            '#pk': 'PK',
          },
        }))
        Item.messages = messagesRes.Items
        res.status(200).json(Item)
      } else {
        res.status(404).json({error: 'No chat found'})
      }
    } catch (e) {
      res.status(500).json({error: 'No chat found'})
    }
  } else if (req.method === 'PATCH') {
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
        TableName: 'abandonai-prod',
        Key: {
          PK: `USER#${user_id}`,
          SK: `CHAT#${id}`,
        },
        UpdateExpression: `SET ${UpdateExpression}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      }))
      res.status(200).json({success: true})
    } catch (e) {
      res.status(500).json({success: false})
    }
  } else if (req.method === 'DELETE') {
    const {id} = req.query
    try {
      await ddbDocClient.send(new DeleteCommand({
        TableName: 'abandonai-prod',
        Key: {
          PK: `USER#${user_id}`,
          SK: `CHAT#${id}`,
        },
      }))
      res.status(200).json({success: true})
    } catch (e) {
      res.status(500).json({success: false})
    }
  }
})