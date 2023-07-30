const userLimit = {
  'gpt-3.5-turbo': {
    requests: [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    tokens: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  'gpt-4': {
    requests: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tokens: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
}

const RATE_LIMIT = {
  'gpt-3.5-turbo': {
    'reset-hours': 3,
    'limit-requests': 100,
    'limit-tokens': 100 * 2000,
  },
  'gpt-4': {
    'reset-hours': 3,
    'limit-requests': 50,
    'limit-tokens': 50 * 2000,
  },
}

const hour = new Date().getHours()
console.log('hour:', hour)

const total_request_gpt3_5_turbo = userLimit['gpt-3.5-turbo']
    .requests
    .slice(hour - RATE_LIMIT['gpt-3.5-turbo']['reset-hours'] + 1, hour + 1)
    .reduce((a, b) => a + b, 0)
console.log(total_request_gpt3_5_turbo)

if (total_request_gpt3_5_turbo > RATE_LIMIT['gpt-3.5-turbo']['limit-requests']) {
  console.log('limit')
} else {
  console.log('ok')
}

// 计算remain request
const remain_request_gpt3_5_turbo = RATE_LIMIT['gpt-3.5-turbo']['limit-requests'] - total_request_gpt3_5_turbo

console.log('remain_request_gpt3_5_turbo:', remain_request_gpt3_5_turbo)

// 计算 reset-requests, 为此刻到下一个周期的时间，周期为 RATE_LIMIT['gpt-3.5-turbo']['reset-hours']
const period_has_pass = Math.floor(hour / RATE_LIMIT['gpt-3.5-turbo']['reset-hours'])
// 已经过去了 period_has_pass 个周期
console.log(period_has_pass)
// 第 period_has_pass + 1 个周期将开始于今日的0点开始，往后的第period_has_pass + 1小时的时间
const next_period_start_time = new Date(new Date().setHours((period_has_pass + 1) * RATE_LIMIT['gpt-3.5-turbo']['reset-hours'], 0, 0, 0))
// 计算与现在的时间查
const reset = (next_period_start_time - new Date()) / 1000 / 60
console.log('reset:', reset)

// 计算remain requests



// 计算remain tokens
