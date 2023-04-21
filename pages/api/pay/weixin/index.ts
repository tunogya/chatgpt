import type { NextApiRequest, NextApiResponse } from 'next';
import WxPay from 'wechatpay-node-v3';
import fs from 'fs';

const pay = new WxPay({
  appid: 'wxc7d6f9e23b346d39',
  mchid: '1642508849',
  publicKey: fs.readFileSync('./apiclient_cert.pem'),
  privateKey: fs.readFileSync('./apiclient_key.pem'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const params = {
      appid: 'wxc7d6f9e23b346d39',
      mchid: '1642508849',
      description: '测试',
      out_trade_no: '123456789',
      notify_url: 'http://localhost:3000/api/pay/weixin/notify',
      amount: {
        total: 1,
      },
    };
    const data = await pay.transactions_native(params)
    res.status(200).json({status: 'ok', data});
  } catch (error) {
    console.log(error);
  }
}
