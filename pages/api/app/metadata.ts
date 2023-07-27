import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // @ts-ignore
    const {user} = await getSession(req, res);
    const user_id = user.sub;
    try {
      const response = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: user_id,
          SK: 'METADATA#chatgpt',
        }
      }))
      const data = await response.Item
      if (data) {
        res.status(200).json(data)
      } else {
        const newItem = {
          PK: user_id,
          SK: 'METADATA#chatgpt',
          paidUseTTL: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // This is gpt-3.5
          gpt4TTL: 0,
        }
        await ddbDocClient.send(new PutCommand({
          TableName: 'wizardingpay',
          Item: newItem,
          ConditionExpression: 'attribute_not_exists(PK)',
        }))
        res.status(200).json(newItem)
      }
    } catch (e) {
      res.status(404).json({error: e})
    }
  } else {
    res.status(500).json({error: "Only support GET method"})
  }
})