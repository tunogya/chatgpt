import WxPay from "wechatpay-node-v3";
import fs from "fs";
import * as process from "process";

const wxPayClient = new WxPay({
  appid: process.env.WEIXIN_APP_ID!,
  mchid: process.env.WEIXIN_MCH_ID!,
  publicKey: fs.readFileSync('./apiclient_cert.pem'),
  privateKey: fs.readFileSync('./apiclient_key.pem'),
  key: process.env.WEIXIN_APIV3_KEY,
});

export default wxPayClient