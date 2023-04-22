import type { NextApiRequest, NextApiResponse } from 'next';
import pay from "@/utils/WxPay";
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  const {total, description, out_trade_no, attach} = req.body;
  try {
    const params = {
      appid: 'wxc7d6f9e23b346d39',
      mchid: '1642508849',
      description,
      out_trade_no: out_trade_no,
      notify_url: 'https://www.abandon.chat/api/pay/weixin/notify',
      amount: {
        total,
      },
      attach
    };
    const data = await pay.transactions_native(params)
    res.status(200).json({status: 'ok', data});
  } catch (error) {
    console.log(error);
  }
});
