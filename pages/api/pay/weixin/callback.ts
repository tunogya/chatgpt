import {NextApiRequest, NextApiResponse} from "next";
import pay from "@/utils/WxPay";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, PutCommand, TransactWriteCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.headers['wechatpay-signature'] as string;
  try {
    const isValid = await pay.verifySign({
      timestamp: req.headers['wechatpay-timestamp'] as string,
      nonce: req.headers['wechatpay-nonce'] as string,
      body: req.body,
      serial: req.headers['wechatpay-serial'] as string,
      signature,
    })
    if (!isValid) {
      res.status(400).json({error: 'invalid signature'});
      return;
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
    return;
  }
  const resource = await pay.decipher_gcm(req.body.resource.ciphertext, req.body.resource.associated_data, req.body.resource.nonce);
  // @ts-ignore
  const {topic, count, user} = JSON.parse(resource.attach);
  try {
    const metadata = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user,
        SK: `METADATA#${topic}`,
      }
    }))
    const oldPaidUseTTL = metadata.Item?.paidUseTTL || 0;
    const transactionRequest = {
      TransactItems: [
        {
          Put: {
            TableName: 'wizardingpay',
            Item: {
              // @ts-ignore
              ...resource,
              PK: user,
              // @ts-ignore
              SK: `PAY#${resource.out_trade_no}`,
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          }
        },
        {
          Update: {
            TableName: 'wizardingpay',
            Key: {
              PK: user,
              SK: `METADATA#${topic}`,
            },
            UpdateExpression: `SET paidUseTTL = :newPaidUseTTL`,
            ExpressionAttributeValues: {
              ':newPaidUseTTL': Math.max(oldPaidUseTTL, Math.floor(Date.now() / 1000)) + count * 24 * 60 * 60,
            }
          }
        }
      ]
    }
    await ddbDocClient.send(new TransactWriteCommand(transactionRequest))
    res.status(200).json({success: true})
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
    return;
  }
}