import {NextApiRequest, NextApiResponse} from 'next';
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {getCurrentWeekId} from "@/utils/date";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand} from "@aws-sdk/lib-dynamodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const { user } = await getSession(req, res);
  const user_id = user.sub;
  if (req.method === 'GET') {
    // 查询当前日期所在的周的起始日期
    const week = req.query.week || getCurrentWeekId();
    // query the data from dynamodb
    const data = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: `WEEK#${week}`,
      }
    }))
    if (!data.Item) {
      res.status(404).json({error: 'No data found'})
      return
    }
    res.status(200).json(data.Item)
  }
})

// Table Design
// PK: user_id
// SK: WEEK#2021-1
// conversation: [0, 0, 0, 0, 0, 0, 0], // conversation count per day
// available: [0, 0, 0, 0, 0, 0, 0], // available reward per day
// received: [0, 0, 0, 0, 0, 0, 0], // received reward per day

