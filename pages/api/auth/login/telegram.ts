// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb';
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

  const { id, first_name, username, photo_url, auth_date, hash } = req.body

  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: `TG-USER#${id}`,
        SK: `TG-USER#${id}`,
        first_name,
        photo_url,
        auth_date,
      },
    }));
    const token = jwt.sign({
      id: `TG-USER#${id}`,
      username: username,
      iat: Math.floor(Date.now() / 1000) - 3, // 3 seconds before
    }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })
    res.status(200).json({ token })
  } catch (e) {
    res.status(400).json({ error: 'try again later!' })
  }
}
