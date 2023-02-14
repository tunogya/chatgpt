// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {PutCommand} from '@aws-sdk/lib-dynamodb';
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
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password is required' })
    return
  }
  try {
    await ddbDocClient.send(new PutCommand({
      TableName: 'wizardingpay',
      Item: {
        PK: `USER#${username}`,
        SK: `USER#${username}`,
        username,
        password,
        create_at: Math.floor(new Date().getTime() / 1000),
      },
      // if PK is not exists, insert, otherwise, password must be same
      ConditionExpression: 'attribute_not_exists(PK) OR #password = :password',
      ExpressionAttributeNames: {
        '#password': 'password',
      },
      ExpressionAttributeValues: {
        ':password': password,
      }
    }));
    const token = jwt.sign({
      username,
      iat: Math.floor(Date.now() / 1000) - 3, // 3 seconds before
    }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })
    res.status(200).json({ token })
  } catch (e) {
    res.status(400).json({ error: 'error password!' })
  }
}
