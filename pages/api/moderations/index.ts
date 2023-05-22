import {NextApiRequest, NextApiResponse} from 'next';
import aliyunClient from "@/utils/Aliyun";
import redisClient from "@/utils/Redis";
import * as crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }
  const {input} = req.body;
  if (!input) {
    res.status(400).json({error: 'Input is required'});
  }
  let flagged = false, blocked = false;
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  try {
    const redisKey = `flag:${hash}`;
    const redisValue = await redisClient.get(redisKey);
    if (redisValue) {
      flagged = JSON.parse(redisValue).flagged;
      blocked = JSON.parse(redisValue).blocked;
      console.log("get from redis");
      res.status(200).json({flagged, blocked});
      return;
    }
  } catch (e) {
    console.log(e);
  }
  try {
    const response = await aliyunClient.request('TextModeration', {
      "Service": "ai_art_detection",
      "ServiceParameters": JSON.stringify({
        "content": input,
      })
    }, {
      method: 'POST',
      formatParams: false,
    })
    // @ts-ignore
    const labels = response?.Data?.labels || undefined;
    switch (labels) {
      case undefined:
        break;
      // ad：广告
      case 'ad':
        flagged = true;
        blocked = false;
        break;
      // political_content：涉政
      case 'political_content':
        flagged = true;
        blocked = true;
        break;
      // profanity：辱骂
      case 'profanity':
        flagged = true;
        blocked = true;
        break;
      // contraband：违禁品
      case 'contraband':
        flagged = true;
        blocked = true;
        break;
      // sexual_content：色情
      case 'sexual_content':
        flagged = true;
        blocked = true;
        break;
      // violence：暴恐
      case 'violence':
        flagged = true;
        blocked = true;
        break;
      // ad_compliance：广告法合规
      case 'ad_compliance':
        flagged = true;
        blocked = false;
        break;
      // compliance_fin：金融类合规
      case 'compliance_fin':
        flagged = true;
        blocked = true;
        break;
      // nonsense：灌水
      case 'nonsense':
        flagged = true;
        blocked = false;
        break;
      // negative_content：不良场景
      case 'negative_content':
        flagged = true;
        blocked = true;
        break;
      // cyberbullying：网络暴力
      case 'cyberbullying':
        flagged = true;
        blocked = true;
        break;
      // C_customized：用户库命中
      case 'C_customized':
        flagged = true;
        blocked = true;
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err);
  }

  // save result to redis
  try {
    const redisKey = `flag:${hash}`;
    const redisValue = JSON.stringify({
      flagged,
      blocked
    });
    await redisClient.set(redisKey, redisValue);
    await redisClient.expire(redisKey, 60 * 60 * 24 * 7); // 7 days
  } catch (e) {
    console.log(e);
  }
  res.status(200).json({
    service: 'ai_art_detection',
    flagged,
    blocked
  });
}