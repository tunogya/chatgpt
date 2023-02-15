// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {UpdateCommand} from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import {createHash, createHmac} from 'crypto';

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

  const {id, first_name, username, photo_url, auth_date} = req.body

  // // auth_date must be less than 5 minutes
  if (Math.floor(new Date().getTime() / 1000) - auth_date > 300) {
    res.status(400).json({ error: 'timeout, try again later!' })
    return
  }

  const secret = createHash('sha256')
    .update(process.env.BOT_TOKEN || '')
    .digest()

  // @ts-ignore
  function checkSignature({hash, ...data}) {
    const checkString = Object.keys(data)
      .sort()
      .filter((k) => data[k])
      .map(k => (`${k}=${data[k]}`))
      .join('\n');
    const hmac = createHmac('sha256', secret)
      .update(checkString)
      .digest('hex');
    return hmac === hash;
  }

  if (!checkSignature(req.body)) {
    res.status(400).json({error: 'invalid telegram user!'})
    return
  }

  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: `TG-USER#${id}`,
        SK: `TG-USER#${id}`,
      },
      UpdateExpression: 'SET #username = :username, #first_name = :first_name, #photo_url = :photo_url, #update_at = :update_at',
      ExpressionAttributeNames: {
        '#username': 'username',
        '#first_name': 'first_name',
        '#photo_url': 'photo_url',
        '#update_at': 'update_at',
      },
      ExpressionAttributeValues: {
        ':username': username,
        ':first_name': first_name,
        ':photo_url': photo_url,
        ':update_at': Math.floor(new Date().getTime() / 1000),
      }
    }));
    const token = jwt.sign({
      id: `TG-USER#${id}`,
      username: username,
      iat: Math.floor(Date.now() / 1000) - 3, // 3 seconds before
    }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    })
    res.status(200).json({token})
  } catch (e) {
    res.status(400).json({error: 'try again later!'})
  }
}
