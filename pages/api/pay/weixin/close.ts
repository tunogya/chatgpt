import type { NextApiRequest, NextApiResponse } from 'next';
import pay from "@/utils/WxPay";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await pay.close("123")
}