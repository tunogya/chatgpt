import type { NextApiRequest, NextApiResponse } from 'next';
import pay from "@/utils/WxPay";
import {withApiAuthRequired} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {out_trade_no} = req.query;
  if (!out_trade_no) {
    res.status(400).json({error: 'Bad Request'});
    return;
  }
  try {
    const data = await pay.close(out_trade_no as string)
    res.status(200).json({status: 'ok', data});
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
  }
});
