import type { NextApiRequest, NextApiResponse } from 'next';
import wxPayClient from "@/utils/wxPayClient";
import {withApiAuthRequired} from "@auth0/nextjs-auth0";
import auth0Management from "@/utils/auth0Management";
import {CHATGPT_MEMBERSHIP} from "@/const/misc";
export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  const {
    description,
    out_trade_no,
    user,  // auth0 user object
    product // product object, quantity、topic、total
  } = req.body;
  const userInfo = await auth0Management.getUser({
    id: user.sub,
  })
  const chatgpt_standard_exp = userInfo?.app_metadata?.vip?.chatgpt_standard ? new Date(userInfo?.app_metadata?.vip?.chatgpt_standard) : new Date()
  const chatgpt_plus_exp = userInfo?.app_metadata?.vip?.chatgpt_plus ? new Date(userInfo?.app_metadata?.vip?.chatgpt_plus) : new Date()
  let metadata = {}
  if (product.topic === CHATGPT_MEMBERSHIP.STANDARD) {
    chatgpt_standard_exp.setMonth(chatgpt_standard_exp.getMonth() + product.quantity)
    metadata = {
      vip: {
        chatgpt_standard: chatgpt_standard_exp.toISOString(),
      }
    }
  } else if (product.topic === CHATGPT_MEMBERSHIP.PLUS) {
    chatgpt_plus_exp.setMonth(chatgpt_plus_exp.getMonth() + product.quantity)
    metadata = {
      vip: {
        chatgpt_plus: chatgpt_plus_exp.toISOString(),
      }
    }
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
        metadata: metadata,
      }),
    };
    const data = await wxPayClient.transactions_native(params)
    res.status(200).json({status: 'ok', data});
  } catch (error) {
    console.log(error);
  }
});
