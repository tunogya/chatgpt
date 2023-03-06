// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
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
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    res.status(401).json({error: 'invalid token'})
    return
  }
  jwt.verify(accessToken, process.env.JWT_SECRET || '', async (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({error: 'invalid token'})
      return
    }
    const user_id = decoded.id;
    // get user info
    const {Item} = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: user_id,
      }
    }));
    if (!Item) {
      res.status(404).json({error: 'no user found!'})
      return
    }
    const new_accessToken = jwt.sign({
      id: Item.PK,
      username: Item.username,
      iat: Math.floor(Date.now() / 1000) - 3, // 3 seconds before
    }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    });
    res.status(200).json({
      user: {
        id: Item.PK,
        username: Item.username || undefined,
        photo_url: Item.photo_url || undefined,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      accessToken: new_accessToken,
    })
  })
}
