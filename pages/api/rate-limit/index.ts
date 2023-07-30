/*
  x-ratelimit-limit-requests	60	The maximum number of requests that are permitted before exhausting the rate limit.
  x-ratelimit-limit-tokens	150000	The maximum number of tokens that are permitted before exhausting the rate limit.
  x-ratelimit-remaining-requests	59	The remaining number of requests that are permitted before exhausting the rate limit.
  x-ratelimit-remaining-tokens	149984	The remaining number of tokens that are permitted before exhausting the rate limit.
  x-ratelimit-reset-requests	1s	The time until the rate limit (based on requests) resets to its initial state.
  x-ratelimit-reset-tokens	6m0s	The time until the rate limit (based on tokens) resets to its initial state.
 */

import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import redisClient from "@/utils/redisClient";
import {RATE_LIMIT} from "@/pages/const/misc";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const {user} = await getSession(req, res);
  // 访问redis查询用户的rate-limit记录
  let userLimit = await redisClient.client.get(`${user.sub}:limit:${new Date().toISOString().slice(0, 10)}`)
  if (!userLimit) {
    // 如果没有，则创建并返回新的记录，TTL为1天
    userLimit = await redisClient.client.set(`${user.sub}:limit:${new Date().toISOString().slice(0, 10)}`, JSON.stringify({
      'gpt-3.5-turbo': {
        requests: Array(12).fill(0),
        tokens: Array(12).fill(0),
      },
      'gpt-4': {
        requests: Array(12).fill(0),
        tokens: Array(12).fill(0),
      },
    }), {
      EX: 86400,
      NX: true,
    })
  }
  if (!userLimit) {
    return res.status(500).json({
      message: 'Internal Server Error',
    })
  }
  userLimit = JSON.parse(userLimit)
  let rate_limit = {
    ...RATE_LIMIT
  }
  //



  return res.status(200).json(rate_limit)
})