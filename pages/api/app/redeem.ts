import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, TransactWriteCommand} from "@aws-sdk/lib-dynamodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const cdkey = req.query.cdkey;
    if (!cdkey) {
      res.status(400).json({error: 'Invalid cdkey'})
      return
    }
    const data = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: 'CHATGPT#CDKEY',
        SK: cdkey,
      }
    }))
    if (!data.Item) {
      res.status(400).json({error: 'Invalid cdkey'})
      return
    }
    res.status(200).json({status: 'ok', data: data.Item})
    return
  }

  if (req.method === 'POST') {
    // @ts-ignore
    const { user } = await getSession(req, res);
    const cdkey = req.body.cdkey;
    const data = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: 'CHATGPT#CDKEY',
        SK: cdkey,
      }
    }))
    if (!data.Item || data.Item.used === true) {
      res.status(400).json({error: 'Invalid cdkey'})
      return
    }
    const quantity = data.Item.quantity;
    const userMetadata = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user.sub,
        SK: `METADATA#chatgpt`,
      }
    }))
    if (!userMetadata.Item) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    // 更新两个表
    const transactionRequest: any = {
      TransactItems: [
        {
          Update: {
            TableName: 'wizardingpay',
            Key: {
              PK: 'CHATGPT#CDKEY',
              SK: cdkey,
            },
            UpdateExpression: `SET #used = :newUsed, #user = :newUser, #updated = :newUpdated`,
            ConditionExpression: 'used = :oldUsed AND attribute_exists(PK)',
            ExpressionAttributeValues: {
              ':newUsed': true,
              ':newUser': user,
              ':newUpdated': Math.floor(Date.now() / 1000),
              ':oldUsed': false,
            },
            ExpressionAttributeNames: {
              '#used': 'used',
              '#user': 'user',
              '#updated': 'updated',
            }
          }
        },
        {
          Update: {
            TableName: 'wizardingpay',
            Key: {
              PK: user.sub,
              SK: `METADATA#chatgpt`,
            },
            UpdateExpression: `SET paidUseTTL = :newPaidUseTTL`,
            ExpressionAttributeValues: {
              ':newPaidUseTTL': Math.max(userMetadata.Item.paidUseTTL, Math.floor(Date.now() / 1000)) + 24 * 60 * 60 * quantity,
            },
          }
        }
      ]
    }
    await ddbDocClient.send(new TransactWriteCommand(transactionRequest))
    res.status(200).json({status: 'ok'})
    return
  }
  res.status(500).json({error: "Only support GET and POST method"})
})