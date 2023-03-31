import {NextApiRequest, NextApiResponse} from 'next';
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {getCurrentWeekId} from "@/utils/DateUtil";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const { user } = await getSession(req, res);
  const user_id = user.sub;
  if (req.method === 'GET') {
    const week = req.query.week || getCurrentWeekId();
    const data = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: `WEEK#${week}`,
      }
    }))
    if (!data.Item) {
      const new_item = {
        PK: user_id,
        SK: `WEEK#${week}`,
        conversation: [0, 0, 0, 0, 0, 0, 0],
        rewards: {
          '1D': {
            available: 0,
            received: 0,
          },
          '2D': {
            available: 0,
            received: 0,
          },
          '4D': {
            available: 0,
            received: 0,
          },
          '7D': {
            available: 0,
            received: 0,
          }
        }
      }
      await ddbDocClient.send(new PutCommand({
        TableName: 'wizardingpay',
        Item: new_item,
        ConditionExpression: 'attribute_not_exists(PK)',
      }))
      res.status(200).json(new_item)
    } else {
      res.status(200).json(data.Item)
    }
  }
})

