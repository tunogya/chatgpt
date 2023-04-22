import {NextApiRequest, NextApiResponse} from "next";
import pay from "@/utils/WxPay";

const APIV3_KEY = process.env.APIV3_KEY || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  // 获取请求的签名
  const signature = req.headers['wechatpay-signature'] as string;
  try {
    // 验证签名
    const isValid = await pay.verifySign({
      timestamp: req.headers['wechatpay-timestamp'] as string,
      nonce: req.headers['wechatpay-nonce'] as string,
      body: req.body,
      serial: req.headers['wechatpay-serial'] as string,
      signature,
    })
    console.log("isValid", isValid)
    if (!isValid) {
      res.status(400).json({error: 'invalid signature'});
      return;
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
    return;
  }
  const resource = await pay.decipher_gcm(req.body.resource.ciphertext, req.body.resource.associated_data, req.body.resource.nonce, APIV3_KEY);
  console.log("resource", resource)
  console.log("准备更新用户的metadata信息")
  try {
    console.log(req.body);
    res.status(200).json({
      status: 'ok',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({status: 'error'});
  }
}