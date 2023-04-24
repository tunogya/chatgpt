import {withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, TransactWriteCommand} from "@aws-sdk/lib-dynamodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  const {user, referrer} = req.body;
  if (user && referrer) {
    res.status(200).json({status: 'ok'});
    if (referrer === user) {
      res.status(400).json({error: 'You cannot refer yourself'});
    }
    const date = new Date().toLocaleDateString();
    const referrerMetadata = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: referrer,
        SK: `METADATA#chatgpt`,
      }
    }))
    const userMetadata = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user,
        SK: `METADATA#chatgpt`,
      }
    }))
    if (!referrerMetadata.Item || !userMetadata.Item) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    const transactionRequest: any = {
      TransactItems: [
        {
          Put: {
            TableName: 'wizardingpay',
            Item: {
              PK: referrer,
              SK: `REF#${date}#${user}`,
              TTL: 7 * 24 * 60 * 60 + Math.floor(Date.now() / 1000), // 7 days
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          }
        },
        {
          Update: {
            TableName: 'wizardingpay',
            Key: {
              PK: referrer,
              SK: `METADATA#chatgpt`,
            },
            UpdateExpression: `SET freeUseTTL = :newFreeUseTTL`,
            ExpressionAttributeValues: {
              ':newFreeUseTTL': Math.max(referrerMetadata.Item.freeUseTTL, Math.floor(Date.now() / 1000)) + 24 * 60 * 60,
            },
            ConditionExpression: 'attribute_exists(PK)',
          }
        },
        {
          Update: {
            TableName: 'wizardingpay',
            Key: {
              PK: user,
              SK: `METADATA#chatgpt`,
            },
            UpdateExpression: `SET freeUseTTL = :newFreeUseTTL`,
            ExpressionAttributeValues: {
              ':newFreeUseTTL': Math.max(userMetadata.Item.freeUseTTL, Math.floor(Date.now() / 1000)) + 24 * 60 * 60,
            },
            ConditionExpression: 'attribute_exists(PK)',
          }
        }
      ]
    }
    await ddbDocClient.send(new TransactWriteCommand(transactionRequest))
    res.status(200).json({success: true})
  } else {
    res.status(400).json({error: 'Bad Request'});
  }
})