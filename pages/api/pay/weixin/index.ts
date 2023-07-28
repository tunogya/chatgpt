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
  // description, out_trade_no, user, product
  // product: {
  //   topic: string
  //   quantity: number,
  //   total: number,
  // },
  const {description, out_trade_no, user, product} = req.body;
  let chatgpt_standard = '', chatgpt_plus = '';
  // TODO
  if (product.topic === '') {
    chatgpt_standard = ''
  } else if (product.topic === '') {
    chatgpt_plus = ''
  }
  try {
    const params = {
      appid: process.env.WEIXIN_APP_ID,
      mchid: process.env.WEIXIN_MCH_ID,
      description: description,
      out_trade_no: out_trade_no,
      notify_url: 'https://www.abandon.chat/api/pay/weixin/callback',
      amount: {
        total: product.total * 100,
        currency: 'CNY',
      },
      attach: JSON.stringify({
        id: user.sub,
        metadata: {
          vip: {
            chatgpt_standard: chatgpt_standard,
            chatgpt_plus: chatgpt_plus,
          }
        },
      }),
    };
    const data = await wxPayClient.transactions_native(params)
    res.status(200).json({status: 'ok', data});
  } catch (error) {
    console.log(error);
  }
});
