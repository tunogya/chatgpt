import {NextApiRequest, NextApiResponse} from "next";
import wxPayClient from "@/utils/wxPayClient";
import auth0Management from "@/utils/auth0Management";
import me from "@/pages/api/me";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.headers['wechatpay-signature'] as string;
  try {
    const isValid = await wxPayClient.verifySign({
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
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
    return;
  }
  const resource = await wxPayClient.decipher_gcm(req.body.resource.ciphertext, req.body.resource.associated_data, req.body.resource.nonce);
  // metadata is the latest user's metadata, need to be updated to user's info
  // the id is the user_id
  // @ts-ignore
  const {metadata, id} = JSON.parse(resource.attach);
  try {
    await auth0Management.updateAppMetadata({id}, {
      ...metadata
    })
    res.status(200).json({success: true})
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
    return;
  }
}