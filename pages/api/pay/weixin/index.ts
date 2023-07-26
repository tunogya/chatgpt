import type { NextApiRequest, NextApiResponse } from 'next';
import pay from "@/utils/WxPay";
import {withApiAuthRequired} from "@auth0/nextjs-auth0";
import {PLANS} from "@/pages/pay/[id]";
export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  const {description, out_trade_no, quantity, topic, attach} = req.body;
  let total = 0;
  if (topic === 'chatgpt' && quantity > 0) {
    total = (PLANS.find((p) => p.quantity === quantity)?.gpt3_5_total || 0) * 100;
    if (total <= 0) {
      total = quantity * 100;
    }
  } else {
    res.status(400).json({error: 'Bad Request'});
    return;
  }
  try {
    const params = {
      appid: 'wxc7d6f9e23b346d39',
      mchid: '1642508849',
      description,
      out_trade_no: out_trade_no,
      notify_url: 'https://www.abandon.chat/api/pay/weixin/callback',
      amount: {
        total: total,
      },
      attach,
    };
    const data = await pay.transactions_native(params)
    res.status(200).json({status: 'ok', data});
  } catch (error) {
    console.log(error);
  }
});
