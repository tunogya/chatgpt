export const OpenAIModel = {
  GPT3_5: {
    topic: 'GPT-3.5',
    model: 'gpt-3.5-turbo',
  },
  GPT4: {
    topic: 'GPT-4',
    model: 'gpt-4'
  }
}

export const PLANS = [
  {
    name: 'GPT-3.5 Monthly Member Card',
    quantity: 30,
    total: 30,
    month: 30,
    topic: OpenAIModel.GPT3_5.topic,
  },
  {
    name: 'GPT-3.5 Quarterly Member Card',
    quantity: 90,
    total: 60,
    month: 20,
    topic: OpenAIModel.GPT3_5.topic,
  },
  {
    name: 'GPT-3.5 Yearly Member Card',
    quantity: 365,
    total: 228,
    month: 19,
    topic: OpenAIModel.GPT3_5.topic,
  },
  {
    name: 'GPT-4 Monthly Member Card',
    quantity: 30,
    total: 120,
    month: 120,
    topic: OpenAIModel.GPT4.topic,
  },
  {
    name: 'GPT-4 Quarterly Member Card',
    quantity: 90,
    total: 324,
    month: 108,
    topic: OpenAIModel.GPT4.topic,
  },
  {
    name: 'GPT-4 Yearly Member Card',
    quantity: 365,
    total: 1200,
    month: 100,
    topic: OpenAIModel.GPT4.topic,
  },
]