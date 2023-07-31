export const CHATGPT_MEMBERSHIP = {
  STANDARD: "chatgpt_standard",
  PLUS: "chatgpt_plus",
}

export const OPENAI_MODELS = {
  GPT3_5: {
    topic: 'GPT-3.5',
    model: 'gpt-3.5-turbo',
  },
  GPT4: {
    topic: 'GPT-4',
    model: 'gpt-4',
  }
}

export const PRODUCTS = [
  {
    name: 'ChatGPT Standard Monthly',
    quantity: 31,
    total: 30,
    original: 30,
    topic: CHATGPT_MEMBERSHIP.STANDARD,
  },
  {
    name: 'ChatGPT Standard Quarterly',
    quantity: 3 * 31,
    total: 60,
    original: 3 * 30,
    topic: CHATGPT_MEMBERSHIP.STANDARD,
  },
  {
    name: 'ChatGPT Standard Yearly',
    quantity: 12 * 31,
    total: 228,
    original: 12 * 30,
    topic: CHATGPT_MEMBERSHIP.STANDARD,
  },
  {
    name: 'ChatGPT Plus Daily',
    quantity: 1,
    total: 7,
    original: 5,
    topic: CHATGPT_MEMBERSHIP.PLUS,
  },
  {
    name: 'ChatGPT Plus Monthly',
    quantity: 31,
    total: 150,
    original: 150,
    topic: CHATGPT_MEMBERSHIP.PLUS,
  },
  {
    name: 'ChatGPT Plus Quarterly',
    quantity: 3 * 31,
    total: 390,
    original: 3 * 150,
    topic: CHATGPT_MEMBERSHIP.PLUS,
  },
  {
    name: 'ChatGPT Plus Yearly',
    quantity: 12 * 31,
    total: 1440,
    original: 12 * 150,
    topic: CHATGPT_MEMBERSHIP.PLUS,
  },
]

export const RATE_LIMIT = {
  'gpt-3.5-turbo': {
    'reset-hours': 1,
    'limit-requests': 100,
    'limit-tokens': 100 * 2000,
  },
  'gpt-4': {
    'reset-hours': 3,
    'limit-requests': 50,
    'limit-tokens': 50 * 2000,
  },
}