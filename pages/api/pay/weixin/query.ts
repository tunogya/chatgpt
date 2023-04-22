import type { NextApiRequest, NextApiResponse } from 'next';
import pay from "@/utils/WxPay";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${trade_no}?mchid=${}
  await pay.query({
    out_trade_no: "123"
  })
}