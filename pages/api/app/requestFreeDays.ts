import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, TransactWriteCommand} from "@aws-sdk/lib-dynamodb";
import {getCurrentWeekId} from "@/utils/DateUtil";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // @ts-ignore
    const {user} = await getSession(req, res);
    const user_id = user.sub;
    const type = req.body.type;
    if (!['1D', '2D', '4D', '7D'].includes(type)) {
      res.status(400).json({error: "Invalid type"});
      return;
    }
    const week = req.query.week || getCurrentWeekId();
    const data = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: `WEEK#${week}`,
      }
    }))
    const metadata = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: 'METADATA#chatgpt',
      }
    }))
    if (data.Item) {
      // check data.Item.rewards[type], check available and received, if available > received, then update received
      if (data.Item.rewards[type].available > data.Item.rewards[type].received) {
        const newAddDays = data.Item.rewards[type].available - data.Item.rewards[type].received;
        const oldFreeUseTTL = metadata.Item?.freeUseTTL || 0;
        const transactionRequest = {
          TransactItems: [
            {
              Update: {
                TableName: 'wizardingpay',
                Key: {
                  PK: user_id,
                  SK: `WEEK#${week}`,
                },
                UpdateExpression: `SET rewards = :new_rewards`,
                ExpressionAttributeValues: {
                  ':new_rewards': {
                    ...data.Item.rewards,
                    [type]: {
                      ...data.Item.rewards[type],
                      received: data.Item.rewards[type].available,
                    }
                  },
                }
              }
            },
            {
              Update: {
                TableName: 'wizardingpay',
                Key: {
                  PK: user_id,
                  SK: 'METADATA#chatgpt',
                },
                UpdateExpression: `SET freeUseTTL = :newFreeUseTTL`,
                ExpressionAttributeValues: {
                  ':newFreeUseTTL': Math.max(oldFreeUseTTL, Math.floor(Date.now() / 1000)) + newAddDays * 24 * 60 * 60,
                }
              }
            }
          ]
        }
        try {
          await ddbDocClient.send(new TransactWriteCommand(transactionRequest))
          res.status(200).json({success: true})
        } catch (e) {
          console.log(e)
          res.status(500).json({error: "Failed to update rewards"})
        }
      }
    } else {
      res.status(404).json({error: "User not found"})
    }
  } else {
    res.status(500).json({error: "Only support POST method"})
  }
})