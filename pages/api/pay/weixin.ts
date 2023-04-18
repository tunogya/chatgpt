import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto';
import fs from 'fs';
//
// type Data = {
//   name: string
// }

function createRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

function createSign(method: string, url: string, timestamp: number, nonce_str: string, order: any) {
  let signStr = `${method}\n${url}\n${timestamp}\n${nonce_str}\n${JSON.stringify(
    order
  )}\n`;
  let cert = fs.readFileSync('./apiclient_key.pem', 'utf-8');
  let sign = crypto.createSign('RSA-SHA256');
  sign.update(signStr);
  return sign.sign(cert, 'base64');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { order, serial_no } = req.body
  let timestamp = Math.floor(new Date().getTime() / 1000);
  let nonce_str = createRandomString(32);
  let signature = createSign(
    'POST',
    '/v3/pay/transactions/native',
    timestamp,
    nonce_str,
    order
  );
  let Authorization = `WECHATPAY2-SHA256-RSA2048 mchid='xxxx',nonce_str='${nonce_str}',timestamp='${timestamp}',signature='${signature}',serial_no='${serial_no}'`;
  try {
    const requestRes = await fetch('https://api.mch.weixin.qq.com/v3/pay/transactions/native', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Authorization
      },
    })
    const data = await requestRes.json()
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: 'error' })
  }
}
