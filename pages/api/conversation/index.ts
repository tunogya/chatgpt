import {NextApiRequest, NextApiResponse} from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {BatchWriteCommand, GetCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {Readable} from "stream";
import uid from "@/utils/uid";
import { v4 as uuidv4 } from 'uuid';
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const { user } = await getSession(req, res);
  const user_id = user.sub;
  if (req.method === 'GET') {
    const offset = Number(req.query?.offset || 0);
    const limit = Number(req.query?.limit || 20);
    const conversations = await ddbDocClient.send(new QueryCommand({
      TableName: 'wizardingpay',
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':pk': user_id,
        ':sk': 'CONVERSATION#',
      },
      ScanIndexForward: false,
      ProjectionExpression: 'PK, SK, title, created',
      Limit: limit,
    }));
    res.status(200).json({
      items: conversations.Items?.map((item: any) => ({
        id: item.SK,
        title: item.title,
        create_time: item?.created ? new Date(item.created * 1000)?.toLocaleString() : null,
      })),
      total: conversations.Count,
      limit,
      offset,
    });
  }
  else if (req.method === 'POST') {
    const {action, messages, model, parent_message_id} = req.body;
    if (action !== 'next') {
      res.status(400).json({error: 'Currently, only next action is supported.'})
      return
    }
    // Currently, only gpt-3.5-turbo and gpt-3.5-turbo-0301 are supported.
    // https://platform.openai.com/docs/api-reference/chat
    if (model !== 'gpt-3.5-turbo' && model !== 'gpt-3.5-turbo-0301') {
      res.status(400).json({error: 'Currently, only gpt-3.5-turbo and gpt-3.5-turbo-0301 are supported.'})
      return
    }
    let conversation: {
      id: null | string, title: null | string, created: null | number, mapping: {
        [key: string]: any
      },
    } = {
      id: req.body?.conversation_id ?? null,
      title: null,
      created: null,
      mapping: {},
    }
    if (!conversation.id) {
      conversation = {
        ...conversation,
        id: `CONVERSATION#${uid.getUniqueID().toString()}`,
        title: messages[0].content.parts[0],
        created: Math.floor(Date.now() / 1000),
      }
    } else {
      const old_conversation = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: user_id,
          SK: req.body?.conversation_id,
        },
      }));
      conversation = {
        ...conversation,
        id: old_conversation.Item?.SK,
        title: old_conversation.Item?.title,
        created: old_conversation.Item?.created,
        mapping: old_conversation.Item?.mapping,
      }
    }
    // add new user message to mapping
    conversation = {
      ...conversation,
      mapping: {
        ...conversation.mapping,
        [messages[0].id]: {
          id: messages[0].id,
          message: messages[0],
          parent: parent_message_id,
          children: []
        }
      }
    }
    if (parent_message_id === '00000000-0000-0000-0000-000000000000') {
      conversation = {
        ...conversation,
        mapping: {
          ...conversation.mapping,
          ["00000000-0000-0000-0000-000000000000"]: {
            id: "00000000-0000-0000-0000-000000000000",
            message: null,
            parent: null,
            children: [messages[0].id]
          }
        }
      }
    } else {
      conversation = {
        ...conversation,
        mapping: {
          ...conversation.mapping,
          [parent_message_id]: {
            ...conversation.mapping[parent_message_id],
            children: [
              ...conversation.mapping[parent_message_id].children,
              messages[0].id,
            ]
          }
        }
      }
    }

    const full_old_messages = [] as { role: string, content: string }[];
    if (parent_message_id !== '00000000-0000-0000-0000-000000000000') {
      const old_conversation = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: user_id,
          SK: conversation.id,
        }
      }));
      const old_mapping = old_conversation.Item?.mapping ?? {};
      const parent_ids = [parent_message_id];
      let current_parent_id = parent_message_id;
      while (current_parent_id !== '00000000-0000-0000-0000-000000000000') {
        current_parent_id = old_mapping[current_parent_id].parent;
        if (current_parent_id !== '00000000-0000-0000-0000-000000000000') {
          parent_ids.push(current_parent_id);
        } else {
          break;
        }
      }
      parent_ids.reverse().forEach((parent_id) => {
        const parent_message = old_mapping[parent_id].message;
        console.log("parent_message", parent_message)
        full_old_messages.push({
          role: parent_message.role,
          content: parent_message.content.parts[0],
        })
      })
    }
    // put current messages to full_messages
    full_old_messages.push(...messages.map((message: any) => ({
        role: message.role,
        content: message.content.parts[0],
      })
    ))
    try {
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model,
          messages: full_old_messages,
          temperature: 1,
          top_p: 1,
          frequency_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          presence_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
          stream: true, // false is default
          n: 1,
          user: user_id,
        }),
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-Accel-Buffering', 'no');

      const message_id = uuidv4();
      let full_callback_message = {
        author: {
          role: '',
        },
        content: {
          content_type: 'text',
          parts: [""],
        },
        id: '',
        role: '',
      };
      const stream = result.body as any as Readable;
      stream.on('data', (chunk: any) => {
        const lines = chunk
          .toString()
          .split('\n\n')
          .filter((line: string) => line !== '')
          .map((line: string) => line.trim().replace('data: ', ''));
        for (const line of lines) {
          if (line === '[DONE]') {
            console.log('[DONE]')
          } else {
            try {
              const data = JSON.parse(line);
              if (data.choices?.[0].delta?.role) {
                full_callback_message = {
                  ...full_callback_message,
                  role: data.choices[0].delta.role,
                  author: {
                    ...full_callback_message.author,
                    role: data.choices[0].delta.role,
                  }
                }
              }
              if (!data.choices?.[0].delta?.content) {
                return;
              }
              const part = data.choices[0].delta.content
              full_callback_message = {
                ...full_callback_message,
                id: data.choices[0].id,
                content: {
                  ...full_callback_message.content,
                  parts: [
                    full_callback_message.content.parts[0] + part
                  ],
                },
              }
              res.write(`data: ${JSON.stringify({
                id: conversation.id,
                title: messages[0].content.parts[0],
                messages: [
                  {
                    id: message_id,
                    role: full_callback_message.role,
                    content: {
                      content_type: full_callback_message.content.content_type,
                      parts: [
                        part,
                      ],
                    },
                    author: {
                      role: full_callback_message.role,
                    }
                  }
                ],
              })}\n\n`);
            } catch (e) {
              console.log(e)
            }
          }
        }
      });
      stream.on('end', async () => {
        // add ai callback message to conversation and add to user children
        conversation = {
          ...conversation,
          mapping: {
            ...conversation.mapping,
            [message_id]: {
              id: message_id,
              message: full_callback_message,
              parent: messages[0].id,
              children: []
            },
            [messages[0].id]: {
              ...conversation.mapping[messages[0].id],
              children: [
                ...conversation.mapping[messages[0].id].children,
                message_id,
              ]
            }
          }
        }
        await ddbDocClient.send(new PutCommand({
          TableName: 'wizardingpay',
          Item: {
            PK: user_id,
            SK: conversation.id,
            ...conversation,
          }
        }));
        res.write('data: [DONE]\n\n');
        res.end();
      });
      stream.on('error', (error: any) => {
        res.end(`data: ${JSON.stringify({error})}\n\n`);
      });
    } catch (e) {
      console.log(e)
      res.status(500).json({error: "Error"})
    }
  }
  else if (req.method === 'DELETE') {
    const {ids} = req.body;
    try {
      await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          'wizardingpay': ids.slice(0, 25).map((id: string) => ({
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
      console.log(e)
      res.status(500).json({error: "Error"})
      return
    }
  }
})