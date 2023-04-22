import type { NextApiRequest, NextApiResponse } from 'next';
import {withApiAuthRequired} from "@auth0/nextjs-auth0";
import pay from "@/utils/WxPay";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {out_trade_no} = req.query;
  if (!out_trade_no) {
    res.status(400).json({error: 'Bad Request'});
    return;
  }
  await pay.refunds({
    out_trade_no: out_trade_no as string,
    out_refund_no: out_trade_no as string,
    reason: '商品已售完',
    amount: {
      refund: 1,
      total: 1,
      currency: 'CNY'
    }
  })
});