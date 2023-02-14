import {NextApiRequest, NextApiResponse} from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PATCH') {
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
          pk: `CONVERSATION#${id}`,
          sk: `CONVERSATION#${id}`,
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
  else if (req.method === 'GET') {
    const {id} = req.query
    try {
      const result = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          pk: `CONVERSATION#${id}`,
          sk: `CONVERSATION#${id}`,
        },
      }))
      res.status(200).json({data: result.Item})
    } catch (e) {
      res.status(500).json({error: 'No conversation found'})
    }
  }
}