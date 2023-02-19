import {NextApiRequest, NextApiResponse} from 'next';
import jwt from "jsonwebtoken";
import {ddbDocClient} from "@/utils/DynamoDB";
import {BatchWriteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get token from header authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({error: 'invalid token'})
    return
  }
  jwt.verify(token, process.env.JWT_SECRET || '', async (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({error: 'invalid token'})
      return
    }
    const user_id = decoded.id;
    if (req.method === 'GET') {
      const offset = Number(req.query?.offset || 0);
      const limit = Number(req.query?.limit || 20);
      const conversations = await ddbDocClient.send(new QueryCommand({
        TableName: 'wizardingpay',
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
        FilterExpression: '#is_visible = :is_visible',
        ExpressionAttributeNames: {
          '#pk': 'PK',
          '#sk': 'SK',
          '#is_visible': 'is_visible',
        },
        ExpressionAttributeValues: {
          ':pk': user_id,
          ':sk': 'CONVERSATION#',
          ':is_visible': true,
        },
      }));
      res.status(200).json({
        items: conversations.Items?.map((item: any) => ({
          id: item.SK,
          title: item.title,
          create_time: new Date(item.create_at * 1000).toLocaleString(),
        })),
        total: conversations.Count,
        limit,
        offset,
      });
    } else if (req.method === 'POST') {
      const {action, messages, model, parent_message_id} = req.body;
      // get user info
      const user = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: user_id,
          SK: user_id,
        },
      }));
      if (!user.Item) {
        res.status(500).json({error: 'user not found'})
        return
      }
      const balance = user.Item.balance || 0;
      const priority_pass = user.Item.priority_pass || 0;

      if (priority_pass >= Math.floor(Date.now() / 1000)) {
        // no need to check balance
      } else {
        let max_cost;
        if (model === 'text-davinci-003') {
          max_cost = 0.0200 * 4000 / 1000;
        } else if (model === 'text-curie-001') {
          max_cost = 0.0020 * 2048 / 1000;
        } else if (model === 'text-babbage-001') {
          max_cost = 0.0005 * 2048 / 1000;
        } else if (model === 'text-ada-001') {
          max_cost = 0.0004 * 2048 / 1000;
        } else {
          res.status(400).json({error: 'invalid model'})
          return
        }
        if (balance < max_cost) {
          res.status(200).json({
            id: 'insufficient_balance',
            title: messages[0].content.parts[0],
            messages: [
              {
                id: 'insufficient_balance',
                role: 'ai',
                content: {
                  type: 'error',
                  parts: [
                    'Sorry, you do not have enough balance to use this model. Please top up your balance and try again.',
                  ],
                }
              }
            ],
          })
          return
        }
      }
      let conversation_id = req.body?.conversation_id || undefined;
      if (!conversation_id) {
        conversation_id = `CONVERSATION#${uuidv4()}`;
        try {
          await ddbDocClient.send(new PutCommand({
            TableName: 'wizardingpay',
            Item: {
              PK: user_id,
              SK: conversation_id,
              title: messages[0].content.parts[0],
              create_at: Math.floor(Date.now() / 1000),
              TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
              is_visible: true,
            },
          }));
        } catch (e) {
          res.status(500).json({error: 'failed to create conversation'})
          return
        }
      }
      try {
        await ddbDocClient.send(new BatchWriteCommand({
          RequestItems: {
            'wizardingpay': messages.map((message: any) => ({
              PutRequest: {
                Item: {
                  PK: conversation_id,
                  SK: message.id,
                  role: message.role,
                  content: message.content,
                  TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
                }
              },
            }))
          }
        }));
      } catch (e) {
        res.status(500).json({error: 'failed to create conversation'})
        return
      }
      // define init prompt of openai
      let prompt = '';
      if (parent_message_id) {
        try {
          const parent_message = await ddbDocClient.send(new GetCommand({
            TableName: 'wizardingpay',
            Key: {
              PK: conversation_id,
              SK: parent_message_id,
            }
          }));
          const parent_message_role = parent_message.Item?.role;
          const parent_message_content = parent_message.Item?.content.parts[0];
          prompt = prompt + `${parent_message_role}: ${parent_message_content}\n`;
        } catch (e) {
          res.status(500).json({error: 'failed to create conversation'})
        }
      }
      prompt = prompt + `user: ${messages[0].content.parts[0]}\nai: `;
      /** https://platform.openai.com/docs/models/gpt-3
       text-davinci-003 max 4000 tokens, others max 2048 tokens
       **/
      let max_tokens
      if (model === 'text-davinci-003') {
        max_tokens = 4000;
      } else {
        max_tokens = 2048;
      }
      let result = await fetch('https://api.openai.com/v1/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model,
          prompt,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          presence_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          max_tokens,
          // stream: true, // false is default
          n: 1,
          best_of: 1, // 1 is default
          user: user_id,
          stop: ['user:'],
        }),
      });
      /** response example from openai
       {
        id: 'cmpl-6lYpny527dT8FWkDWwdPuDnsLCRsW',
        object: 'text_completion',
        created: 1676793339,
        model: 'text-davinci-003',
        choices: [
          {
            text: '\nThe current price of Bitcoin is $7,346.54.',
            index: 0,
            logprobs: null,
            finish_reason: 'stop'
          }
        ],
        usage: { prompt_tokens: 9, completion_tokens: 14, total_tokens: 23 }
      }
       **/
      const {choices, usage} = await result.json();
      const aiMessages = [
        {
          id: Math.floor(Date.now() / 1000).toString(),
          role: 'ai',
          content: {
            type: 'text',
            parts: [
              choices[0].text,
            ],
          },
          create_at: Math.floor(Date.now() / 1000),
        }
      ]
      if (priority_pass >= Math.floor(Date.now() / 1000)) {
        // no need to update balance
      } else {
        const total_tokens = usage.total_tokens;
        let price;
        if (model === 'text-davinci-003') {
          price = 0.02 / 1000 * total_tokens;
        } else if (model === 'text-curie-001') {
          price = 0.002 / 1000 * total_tokens;
        } else if (model === 'text-babbage-001') {
          price = 0.0005 / 1000 * total_tokens;
        } else if (model === 'text-ada-001') {
          price = 0.0004 / 1000 * total_tokens;
        }
        // update user balance
        await ddbDocClient.send(new UpdateCommand({
          TableName: 'wizardingpay',
          Key: {
            PK: user_id,
            SK: user_id,
          },
          // PK should exist, and balance should gte price
          ConditionExpression: 'attribute_exists(PK) AND #balance >= :price',
          UpdateExpression: 'set #balance = if_not_exists(#balance, :initBalance) - :price',
          ExpressionAttributeValues: {
            ':price': price,
            ':initBalance': 0,
          },
          ExpressionAttributeNames: {
            '#balance': 'balance',
          }
        }))
      }
      await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          'wizardingpay': aiMessages.map((message: any) => ({
            PutRequest: {
              Item: {
                PK: conversation_id,
                SK: message.id,
                role: message.role,
                content: message.content,
                TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
                create_at: Math.floor(Date.now() / 1000),
              }
            },
          }))
        }
      }));
      res.status(200).json({
        id: conversation_id,
        title: messages[0].content.parts[0],
        messages: aiMessages,
      });
    } else if (req.method === 'DELETE') {
      const {ids} = req.body;
      try {
        await ddbDocClient.send(new BatchWriteCommand({
          RequestItems: {
            'wizardingpay': ids.map((id: string) => ({
              DeleteRequest: {
                Key: {
                  PK: user_id,
                  SK: id,
                }
              }
            }))
          }
        }));
        res.status(200).json({success: true})
      } catch (e) {
        res.status(500).json({error: e})
        return
      }
    }
  })
}