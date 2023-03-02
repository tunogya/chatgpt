// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand} from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';

type Data = {
  error?: string
  token?: string
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
    res.status(200).json({
      // @ts-ignore
      id: Item.PK,
      username: Item.username || undefined,
      photo_url: Item.photo_url || undefined,
      token,
    })
  })
}
