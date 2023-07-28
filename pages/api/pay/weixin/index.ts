import type { NextApiRequest, NextApiResponse } from 'next';
import wxPayClient from "@/utils/wxPayClient";
import {withApiAuthRequired} from "@auth0/nextjs-auth0";
export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  const {description, out_trade_no, attach, total} = req.body;
  try {
    const params = {
      appid: 'wxc7d6f9e23b346d39',
      mchid: '1642508849',
      description,
      out_trade_no: out_trade_no,
      notify_url: 'https://www.abandon.chat/api/pay/weixin/callback',
      amount: {
        total: total * 100,
        currency: 'CNY',
      },
      attach,
    };
    const data = await wxPayClient.transactions_native(params)
    res.status(200).json({status: 'ok', data});
  } catch (error) {
    console.log(error);
  }
});
