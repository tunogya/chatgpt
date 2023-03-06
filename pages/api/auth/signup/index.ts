// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {PutCommand} from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';

type Data = {
  error?: string
  user?: {
    id: string
    username?: string
    photo_url?: string
  },
  expires?: string
  accessToken?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password is required' })
    return
  }
  try {
    await ddbDocClient.send(new PutCommand({
      TableName: 'wizardingpay',
      Item: {
        PK: `USER#${username.toLowerCase()}`,
        SK: `USER#${username.toLowerCase()}`,
        username,
        password,
        created: Math.floor(new Date().getTime() / 1000),
      },
      ConditionExpression: 'attribute_not_exists(#PK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
      },
    }));
    const accessToken = jwt.sign({
      id: `USER#${username.toLowerCase()}`,
      username,
      iat: Math.floor(Date.now() / 1000) - 3, // 3 seconds before
    }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })
    res.status(200).json({
      user: {
        id: `USER#${username.toLowerCase()}`,
        username,
        photo_url: undefined,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      accessToken,
    })
  } catch (e) {
    res.status(500).json({ error: '该用户名已存在！' })
  }
}
