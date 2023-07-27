import {NextApiRequest, NextApiResponse} from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {BatchWriteCommand, GetCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {Readable} from "stream";
import uid from "@/utils/uid";
import {v4 as uuidv4} from 'uuid';
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {encode} from "gpt-3-encoder";

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
        title: item.title?.slice(0, 20),
        create_time: item?.created ? new Date(item.created * 1000)?.toLocaleString() : null,
      })),
      total: conversations.Count,
      limit,
      offset,
    });
  } else if (req.method === 'POST') {
    let {action, messages, model, parent_message_id} = req.body;
    if (action !== 'next') {
      res.status(400).json({error: 'Currently, only next action is supported.'})
      return
    }
    // https://platform.openai.com/docs/api-reference/chat
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
      // This is a new conversation, create a new conversation id use uuidv4.
      conversation = {
        ...conversation,
        id: `CONVERSATION#${uid.getUniqueID().toString()}`,
        title: messages[0].content.parts[0]?.slice(0, 20),
        created: Math.floor(Date.now() / 1000),
      }
    } else {
      // Get the old conversation. We can cache the data in the future.
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
        title: old_conversation.Item?.title?.slice(0, 20),
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
        full_old_messages.push({
          role: parent_message.role,
          content: parent_message.content.parts[0],
        })
      })
    }
    // keep all messages in full_messages
    let tokens_count = 0, limit = 0;
    if (model === 'gpt-3.5-turbo') {
      full_old_messages.slice(-4);
      limit = 2048 - encode(messages[0].content.parts[0]).length;
    } else if (model === 'gpt-3.5-turbo-16k') {
      full_old_messages.slice(-6);
      limit = 8192 - encode(messages[0].content.parts[0]).length;
    } else if (model === 'gpt-4') {
      full_old_messages.slice(-4);
      limit = 4096 - encode(messages[0].content.parts[0]).length;
    }
    for (let i = full_old_messages.length - 1; i >= 0; i--) {
      // To find more previous messages, we need to encode the message to get the token count.
      // Make sure total tokens count is less than limit.
      tokens_count += encode(full_old_messages[i].content).length;
      if (tokens_count > limit) {
        full_old_messages.splice(0, i);
        break;
      }
    }

    // // add system message to full_messages
    // if (full_old_messages.length === 0 || full_old_messages[0].role !== 'system') {
    //   full_old_messages.splice(0, 0, {
    //     role: 'system',
    //     content: `You are a friendly AI assistant.`,
    //   })
    // }

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
          Authorization: `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
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
                id: conversation.id,
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
            TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
            ...conversation,
          }
        }));
        res.write('data: [DONE]\n\n');
        res.status(200).end();
      });
      stream.on('error', (error: any) => {
        console.log(error);
        res.write('data: [DONE]\n\n');
        res.status(500).end();
        return;
      });
      req.socket.on('close', () => {
        console.log('[DONE]', new Date().toISOString())
        res.write('data: [DONE]\n\n');
        abortController.abort();
        if (full_callback_message.content.parts[0] === '') {
          res.write('data: [DONE]\n\n');
          res.status(501).end();
          return;
        }
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
        ddbDocClient.send(new PutCommand({
          TableName: 'wizardingpay',
          Item: {
            PK: user_id,
            SK: conversation.id,
            TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
            ...conversation,
          }
        }));
        res.status(200).end();
      })
    } catch (e) {
      console.log(e)
      abortController.abort();
      res.status(500).json({error: "Error"})
      return
    }
  } else if (req.method === 'DELETE') {
    const ids = req.body?.ids || [];
    try {
      await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          'wizardingpay': ids?.slice(0, 25).map((id: string) => ({
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