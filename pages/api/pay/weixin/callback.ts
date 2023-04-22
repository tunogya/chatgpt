import {NextApiRequest, NextApiResponse} from "next";
import pay from "@/utils/WxPay";

const APIV3_KEY = process.env.APIV3_KEY || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  // 获取请求的签名
  const signature = req.headers['wechatpay-signature'] as string;
  // 验证签名
  const isValid = await pay.verifySign({
    timestamp: req.headers['wechatpay-timestamp'] as string,
    nonce: req.headers['wechatpay-nonce'] as string,
    body: req.body,
    serial: req.headers['wechatpay-serial'] as string,
    signature,
  })

  if (!isValid) {
    res.status(400).json({error: 'invalid signature'});
    return;
  }

  // ciphertext: string,     associated_data: string,     nonce: string,     key?: string | undefined): unknown
  const resource = await pay.decipher_gcm(req.body.resource.ciphertext, req.body.resource.associated_data, req.body.resource.nonce, APIV3_KEY);
  console.log(resource)
  // 处理交易成功信息
  // {
  //     "transaction_id":"1217752501201407033233368018",
  //     "amount":{
  //         "payer_total":100,
  //         "total":100,
  //         "currency":"CNY",
  //         "payer_currency":"CNY"
  //     },
  //     "mchid":"1230000109",
  //     "trade_state":"SUCCESS",
  //     "bank_type":"CMC",
  //     "promotion_detail":[
  //         {
  //             "amount":100,
  //             "wechatpay_contribute":0,
  //             "coupon_id":"109519",
  //             "scope":"GLOBAL",
  //             "merchant_contribute":0,
  //             "name":"单品惠-6",
  //             "other_contribute":0,
  //             "currency":"CNY",
  //             "stock_id":"931386",
  //             "goods_detail":[
  //                 {
  //                     "goods_remark":"商品备注信息",
  //                     "quantity":1,
  //                     "discount_amount":1,
  //                     "goods_id":"M1006",
  //                     "unit_price":100
  //                 },
  //                 {
  //                     "goods_remark":"商品备注信息",
  //                     "quantity":1,
  //                     "discount_amount":1,
  //                     "goods_id":"M1006",
  //                     "unit_price":100
  //                 }
  //             ]
  //         },
  //         {
  //             "amount":100,
  //             "wechatpay_contribute":0,
  //             "coupon_id":"109519",
  //             "scope":"GLOBAL",
  //             "merchant_contribute":0,
  //             "name":"单品惠-6",
  //             "other_contribute":0,
  //             "currency":"CNY",
  //             "stock_id":"931386",
  //             "goods_detail":[
  //                 {
  //                     "goods_remark":"商品备注信息",
  //                     "quantity":1,
  //                     "discount_amount":1,
  //                     "goods_id":"M1006",
  //                     "unit_price":100
  //                 },
  //                 {
  //                     "goods_remark":"商品备注信息",
  //                     "quantity":1,
  //                     "discount_amount":1,
  //                     "goods_id":"M1006",
  //                     "unit_price":100
  //                 }
  //             ]
  //         }
  //     ],
  //     "success_time":"2018-06-08T10:34:56+08:00",
  //     "payer":{
  //         "openid":"oUpF8uMuAJO_M2pxb1Q9zNjWeS6o"
  //     },
  //     "out_trade_no":"1217752501201407033233368018",
  //     "appid":"wxd678efh567hg6787",
  //     "trade_state_desc":"支付成功",
  //     "trade_type":"MICROPAY",
  //     "attach":"自定义数据",
  //     "scene_info":{
  //         "device_id":"013467007045764"
  //     }
  // }

  try {
    console.log(req.body);
    res.status(200).json({
      status: 'ok',
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({status: 'error'});
  }
}