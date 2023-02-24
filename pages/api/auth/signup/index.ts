// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {PutCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';

type Data = {
  error?: string
  token?: string
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
  const { username, password, ref } = req.body
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
        create_at: Math.floor(new Date().getTime() / 1000),
        priority_pass: Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 3,
      },
      ConditionExpression: 'attribute_not_exists(#PK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
      },
    }));
    if (ref) {
      // update referrer priority pass + 3 days
      await ddbDocClient.send(new UpdateCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: ref,
          SK: ref,
        },
        UpdateExpression: 'SET priority_pass = max(:now, if_not_exists(priority_pass, :now)) + :days',
        ExpressionAttributeValues: {
          ':now': Math.floor(new Date().getTime() / 1000),
          ':days': 60 * 60 * 24 * 3,
        },
        ConditionExpression: 'attribute_exists(#PK)',
      }))
    }
    const token = jwt.sign({
      id: `USER#${username.toLowerCase()}`,
      username,
      iat: Math.floor(Date.now() / 1000) - 3, // 3 seconds before
    }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })
    res.status(200).json({ token })
  } catch (e) {
    res.status(400).json({ error: 'try again later!' })
  }
}
