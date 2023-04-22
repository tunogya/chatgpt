import WxPay from "wechatpay-node-v3";
import fs from "fs";

const pay = new WxPay({
  appid: 'wxc7d6f9e23b346d39',
  mchid: '1642508849',
  publicKey: fs.readFileSync('./apiclient_cert.pem'),
  privateKey: fs.readFileSync('./apiclient_key.pem'),
  key: process.env.WINXIN_APIV3_KEY,
});

export default pay