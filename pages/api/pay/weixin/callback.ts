import {NextApiRequest, NextApiResponse} from "next";
import wxPayClient from "@/utils/wxPayClient";
import ddbDocClient from "@/utils/ddbDocClient";
import {GetCommand} from "@aws-sdk/lib-dynamodb";
import {OpenAIModel} from "@/pages/const/misc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.headers['wechatpay-signature'] as string;
  try {
    const isValid = await wxPayClient.verifySign({
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
  const resource = await wxPayClient.decipher_gcm(req.body.resource.ciphertext, req.body.resource.associated_data, req.body.resource.nonce);
  // @ts-ignore
  const {topic, quantity, user} = JSON.parse(resource.attach);
  let gpt3_5_quantity = 0, gpt4_quantity = 0;
  if (topic === OpenAIModel.GPT3_5.topic) {
    gpt3_5_quantity = quantity;
  } else if (topic === OpenAIModel.GPT4.topic) {
    // 如果是GPT-4,则均增加TTL
    gpt3_5_quantity = quantity;
    gpt4_quantity = quantity;
  }
  try {
    const metadata = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user,
        SK: `METADATA#chatgpt`,
      }
    }))
    const oldPaidUseTTL = metadata.Item?.paidUseTTL || 0;
    const oldGPT4TTL = metadata.Item?.gpt4TTL || 0;
    // ':newPaidUseTTL': Math.max(oldPaidUseTTL, Math.floor(Date.now() / 1000)) + gpt3_5_quantity * 24 * 60 * 60,
    // ':newGpt4TTL': Math.max(oldGPT4TTL, Math.floor(Date.now() / 1000)) + gpt4_quantity * 24 * 60 * 60,
    res.status(200).json({success: true})
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
    return;
  }
}