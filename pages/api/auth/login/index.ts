// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand} from '@aws-sdk/lib-dynamodb';
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
  // check method, only POST is allowed
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
    const { Item } = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: `USER#${username.toLowerCase()}`,
        SK: `USER#${username.toLowerCase()}`,
      },
    }));
    if (!Item) {
      res.status(400).json({ error: 'no user found!' })
      return
    }
    if (Item.password !== password) {
      res.status(400).json({ error: 'error password!' })
      return
    }
    const accessToken = jwt.sign({
      id: `USER#${username}`,
      iat: Math.floor(Date.now() / 1000) - 3, // 3 seconds before
    }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })
    res.status(200).json({
      user: {
        id: `USER#${username}`,
        username: Item.username || undefined,
        photo_url: Item.photo_url || undefined,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      accessToken,
    })
  } catch (e) {
    res.status(400).json({ error: 'try again later!' })
  }
}
