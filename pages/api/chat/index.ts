import {NextApiRequest, NextApiResponse} from 'next';
import ddbDocClient from "@/utils/ddbDocClient";
import {BatchWriteCommand, GetCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {Readable} from "stream";
import uidClient from "@/utils/uidClient";
import {v4 as uuidv4} from 'uuid';
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {encode} from "gpt-3-encoder";
import {OPENAI_MODELS} from "@/const/misc";
import auth0Management from "@/utils/auth0Management";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const {user} = await getSession(req, res);
  const user_id = user.sub;
  if (req.method === 'GET') {
    const offset = Number(req.query?.offset || 0);
    const limit = Number(req.query?.limit || 20);
    const {Items, Count} = await ddbDocClient.send(new QueryCommand({
      TableName: 'abandonai-prod',
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':pk': `USER#${user_id}`,
        ':sk': 'CHAT#',
      },
      ScanIndexForward: false,
      ProjectionExpression: 'PK, SK, title, created',
      Limit: limit,
    }));
    res.status(200).json({
      items: Items?.map((item: any) => ({
        id: item.SK,
        title: item.title?.slice(0, 20),
        create_time: item?.created ? new Date(item.created * 1000)?.toLocaleString() : null,
      })),
      total: Count,
      limit,
      offset,
    });
  } else if (req.method === 'POST') {
    let {action, messages, model, parent_message_id} = req.body;
    const {app_metadata} = await auth0Management.getUser({
      id: user_id,
    })
    const chatgpt_standard = app_metadata?.chatgpt_standard ?? undefined
    const chatgpt_plus = app_metadata?.chatgpt_plus ?? undefined
    if (model === OPENAI_MODELS.GPT4.model) {
      if (!chatgpt_plus || new Date(chatgpt_plus) < new Date()) {
        res.status(400).json({error: 'Chatgpt plus membership is not valid.'})
        return
      }
    } else {
      // require chatgpt_standard is not undefined, and > new Date()
      if (!chatgpt_standard || new Date(chatgpt_standard) < new Date()) {
        res.status(400).json({error: 'Chatgpt standard membership is not valid.'})
        return
      }
    }
    if (action !== 'next') {
      res.status(400).json({error: 'Currently, only next action is supported.'})
      return
    }
    // https://platform.openai.com/docs/api-reference/chat
    let chat: {
      SK: null | string, title: null | string, created: null | number, mapping: {
        [key: string]: any
      }, last_model: string,
    } = {
      SK: req.body?.conversation_id ?? null,
      title: null,
      created: null,
      mapping: {},
      last_model: model,
    }
    if (!chat.SK) {
      // This is a new chat, create a new chat id use uuidv4.
      chat = {
        ...chat,
        SK: `CHAT#${uidClient.getUniqueID().toString()}`,
        title: messages[0].content.parts[0]?.slice(0, 20),
        created: Math.floor(Date.now() / 1000),
      }
    } else {
      // Get the old chat. We can cache the data in the future.
      const {Item} = await ddbDocClient.send(new GetCommand({
        TableName: 'abandonai-prod',
        Key: {
          PK: `USER#${user_id}`,
          SK: req.body?.conversation_id,
        },
      }));
      chat = {
        ...chat,
        SK: Item?.SK,
        title: Item?.title?.slice(0, 20),
        created: Item?.created,
        mapping: Item?.mapping,
      }
    }
    // add new user message to mapping
    chat = {
      ...chat,
      mapping: {
        ...chat.mapping,
        [messages[0].id]: {
          id: messages[0].id,
          message: messages[0],
          parent: parent_message_id,
          children: []
        }
      }
    }
    if (parent_message_id === '00000000-0000-0000-0000-000000000000') {
      chat = {
        ...chat,
        mapping: {
          ...chat.mapping,
          ["00000000-0000-0000-0000-000000000000"]: {
            id: "00000000-0000-0000-0000-000000000000",
            message: null,
            parent: null,
            children: [messages[0].id]
          }
        }
      }
    } else {
      chat = {
        ...chat,
        mapping: {
          ...chat.mapping,
          [parent_message_id]: {
            ...chat.mapping[parent_message_id],
            children: [
              ...chat.mapping[parent_message_id].children,
              messages[0].id,
            ]
          }
        }
      }
    }
    const full_old_messages = [] as { role: string, content: string }[];
    if (parent_message_id !== '00000000-0000-0000-0000-000000000000') {
      const old_mapping = chat?.mapping ?? {};
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
        full_old_messages.push({
          role: parent_message.role,
          content: parent_message.content.parts[0],
        })
      })
    }
    // keep all messages in full_messages
    let prompt_tokens = encode(messages[0].content.parts[0]).length, limit = 0;
    if (model === OPENAI_MODELS.GPT3_5.model) {
      full_old_messages.slice(-4);
      limit = 2048 - prompt_tokens;
    } else if (model === OPENAI_MODELS.GPT4.model) {
      full_old_messages.slice(-4);
      limit = 2048 - prompt_tokens;
    }
    for (let i = full_old_messages.length - 1; i >= 0; i--) {
      // To find more previous messages, we need to encode the message to get the token count.
      // Make sure the total tokens count is less than the limit.
      if (prompt_tokens + encode(full_old_messages[i].content).length > limit) {
        full_old_messages.splice(0, i);
        break;
      }
      prompt_tokens += encode(full_old_messages[i].content).length;
    }

    // put current messages to full_messages
    full_old_messages.push(...messages.map((message: any) => ({
        role: message.role,
        content: message.content.parts[0],
      })
    ))

    const abortController = new AbortController();
    try {
      // https://platform.openai.com/docs/api-reference/chat/create
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
          'OpenAI-Organization': process.env.OPENAI_ORG_ID ?? '',
        },
        method: 'POST',
        body: JSON.stringify({
          model,
          messages: full_old_messages,
          top_p: 0.4, // Number between 0 and 1 that adjusts the "creativity" of the generated responses.
          stream: true, // false is default
          user: user_id,
        }),
        signal: abortController.signal,
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
      let saved = false;
      stream.on('data', (chunk: any) => {
        const lines = chunk
          .toString()
          .split('\n\n')
          .filter((line: string) => line !== '')
          .map((line: string) => line.trim().replace('data: ', ''));
        for (const line of lines) {
          if (line !== '[DONE]') {
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
                continue;
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
                id: chat.SK,
                title: messages[0].content.parts[0].slice(0, 20),
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
        if (full_callback_message.content.parts[0] === '') {
          res.write('data: [DONE]\n\n');
          res.status(200).end();
          return;
        }
        const completion_tokens = encode(full_callback_message.content.parts[0]).length;
        console.log('stream end', user.sub, new Date().toISOString(), model, 'prompt_tokens:', prompt_tokens,  'completion_tokens:', completion_tokens)
        // add a callback message to chat and add to user children
        chat = {
          ...chat,
          mapping: {
            ...chat.mapping,
            [message_id]: {
              id: message_id,
              message: full_callback_message,
              parent: messages[0].id,
              children: []
            },
            [messages[0].id]: {
              ...chat.mapping[messages[0].id],
              children: [
                ...chat.mapping[messages[0].id].children,
                message_id,
              ]
            }
          }
        }
        await ddbDocClient.send(new BatchWriteCommand({
          RequestItems: {
            'abandonai-prod': [
              {
                PutRequest: {
                  Item: {
                    PK: `USER#${user_id}`,
                    TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    ...chat,
                  }
                }
              },
              // {
              //   PutRequest: {
              //     Item: {
              //       PK: `USAGE#${new Date().toISOString().slice(0, 10)}`,
              //       SK: new Date().toISOString(),
              //       customer: {
              //         id: user.sub,
              //         email: user.email,
              //       },
              //       model: model,
              //       usage: {
              //         prompt_tokens: prompt_tokens,
              //         completion_tokens: completion_tokens,
              //         total_tokens: prompt_tokens + completion_tokens,
              //       },
              //       TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 180,
              //     }
              //   }
              // },
            ]
          }
        }));
        saved = true;
        res.write('data: [DONE]\n\n');
        res.status(200).end();
      });
      stream.on('error', (error: any) => {
        res.write('data: [DONE]\n\n');
        res.status(500).end();
        return;
      });
      req.socket.on('close', async () => {
        if (saved) {
          return;
        }
        res.write('data: [DONE]\n\n');
        abortController.abort();
        if (full_callback_message.content.parts[0] === '') {
          res.write('data: [DONE]\n\n');
          res.status(501).end();
          return;
        }
        const completion_tokens = encode(full_callback_message.content.parts[0]).length;
        console.log('socket close:', user.sub, new Date().toISOString(), model, 'prompt_tokens:', prompt_tokens,  'completion_tokens:', completion_tokens)
        chat = {
          ...chat,
          mapping: {
            ...chat.mapping,
            [message_id]: {
              id: message_id,
              message: full_callback_message,
              parent: messages[0].id,
              children: []
            },
            [messages[0].id]: {
              ...chat.mapping[messages[0].id],
              children: [
                ...chat.mapping[messages[0].id].children,
                message_id,
              ]
            }
          }
        }
        await ddbDocClient.send(new BatchWriteCommand({
          RequestItems: {
            'abandonai-prod': [
              {
                PutRequest: {
                  Item: {
                    PK: `USER#${user_id}`,
                    TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    ...chat,
                  }
                }
              },
              // {
              //   PutRequest: {
              //     Item: {
              //       PK: `USAGE#${new Date().toISOString().slice(0, 10)}`,
              //       SK: new Date().toISOString(),
              //       customer: {
              //         id: user.sub,
              //         email: user.email,
              //       },
              //       model: model,
              //       usage: {
              //         prompt_tokens: prompt_tokens,
              //         completion_tokens: completion_tokens,
              //         total_tokens: prompt_tokens + completion_tokens,
              //       },
              //       TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 180,
              //     }
              //   }
              // },
            ]
          }
        }));
        res.status(200).end();
      })
    } catch (e) {
      abortController.abort();
      res.status(500).json({error: "Error"})
      return
    }
  } else if (req.method === 'DELETE') {
    const ids = req.body?.ids || [];
    try {
      await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          'abandonai-prod': ids?.slice(0, 25).map((id: string) => ({
            DeleteRequest: {
              Key: {
                PK: `USER#${user_id}`,
                SK: id,
              }
            }
          }))
        }
      }));
      res.status(200).json({success: true})
    } catch (e) {
      res.status(500).json({error: "Error"})
      return
    }
  }
})