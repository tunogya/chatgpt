import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import {RATE_LIMIT} from "@/const/misc";
import ddbDocClient from "@/utils/ddbDocClient";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const {user} = await getSession(req, res);
  const userLimitRes = await ddbDocClient.send(new GetCommand({
    TableName: 'wizardingpay',
    Key: {
      PK: user.sub,
      SK: `limit:${new Date().toISOString().slice(0, 10)}`,
    },
  }))
  let userLimit = {
    'gpt-3.5-turbo': {
      requests: Array(24).fill(0),
      tokens: Array(24).fill(0),
    },
    'gpt-4': {
      requests: Array(24).fill(0),
      tokens: Array(24).fill(0),
    }
  }
  if (!userLimitRes.Item) {
    // 创建用户的使用限制记录
    await ddbDocClient.send(new PutCommand({
      TableName: 'wizardingpay',
      Item: {
        PK: user.sub,
        SK: `limit:${new Date().toISOString().slice(0, 10)}`,
        TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        ...userLimit,
      }
    }))
  } else {
    userLimit = {
      'gpt-3.5-turbo': userLimitRes.Item['gpt-3.5-turbo'],
      'gpt-4': userLimitRes.Item['gpt-4'],
    }
  }
  const hour = new Date().getHours()
  const period_has_pass_gpt3_5_turbo = Math.floor(hour / RATE_LIMIT['gpt-3.5-turbo']['reset-hours'])
  const period_has_pass_gpt4 = Math.floor(hour / RATE_LIMIT['gpt-4']['reset-hours'])

  const total_request_gpt3_5_turbo = userLimit['gpt-3.5-turbo']
    .requests
    .slice(hour - RATE_LIMIT['gpt-3.5-turbo']['reset-hours'] + 1, hour + 1)
    .reduce((a, b) => a + b, 0)
  const total_tokens_gpt3_5_turbo = userLimit['gpt-3.5-turbo']
    .tokens
    .slice(hour - RATE_LIMIT['gpt-3.5-turbo']['reset-hours'] + 1, hour + 1)
    .reduce((a, b) => a + b, 0)
  const total_request_gpt4 = userLimit['gpt-4']
    .requests
    .slice(hour - RATE_LIMIT['gpt-4']['reset-hours'] + 1, hour + 1)
    .reduce((a, b) => a + b, 0)
  const total_tokens_gpt4 = userLimit['gpt-4']
    .tokens
    .slice(hour - RATE_LIMIT['gpt-4']['reset-hours'] + 1, hour + 1)
    .reduce((a, b) => a + b, 0)
  const next_start_time_gpt3_5_turbo = new Date(new Date().setHours((period_has_pass_gpt3_5_turbo + 1) * RATE_LIMIT['gpt-3.5-turbo']['reset-hours'], 0, 0, 0)).getTime()
  const next_start_time_gpt4 = new Date(new Date().setHours((period_has_pass_gpt4 + 1) * RATE_LIMIT['gpt-4']['reset-hours'], 0, 0, 0)).getTime()

  res.status(200).json({
    'gpt-3.5-turbo': {
      'limit-requests': RATE_LIMIT["gpt-3.5-turbo"]["limit-tokens"],
      'limit-tokens': RATE_LIMIT["gpt-3.5-turbo"]["limit-tokens"],
      'remaining-requests': RATE_LIMIT['gpt-3.5-turbo']['limit-requests'] - total_request_gpt3_5_turbo,
      'remaining-tokens': RATE_LIMIT['gpt-3.5-turbo']['limit-tokens'] - total_tokens_gpt3_5_turbo,
      'reset-requests': Math.ceil((next_start_time_gpt3_5_turbo - new Date().getTime()) / 1000 / 60),
      'reset-tokens': Math.ceil((next_start_time_gpt3_5_turbo - new Date().getTime()) / 1000 / 60),
    },
    'gpt-4': {
      'limit-requests': RATE_LIMIT["gpt-4"]["limit-requests"],
      'limit-tokens': RATE_LIMIT["gpt-4"]["limit-tokens"],
      'remaining-requests': RATE_LIMIT['gpt-4']['limit-requests'] - total_request_gpt4,
      'remaining-tokens': RATE_LIMIT['gpt-4']['limit-tokens'] - total_tokens_gpt4,
      'reset-requests': Math.ceil((next_start_time_gpt4 - new Date().getTime()) / 1000 / 60),
      'reset-tokens': Math.ceil((next_start_time_gpt4 - new Date().getTime()) / 1000 / 60),
    },
  })
})