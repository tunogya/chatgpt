// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {ddbDocClient} from "@/utils/DynamoDB";
import {UpdateCommand} from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
const { subtle } = require("crypto").webcrypto;

type Data = {
  error?: string
  token?: string
}

type TransformInitData = {
  [k: string]: string;
};

async function validate(data: TransformInitData, botToken: string) {
  const encoder = new TextEncoder();

  const checkString = Object.keys(data)
    .filter((key) => key !== "hash")
    .map((key) => `${key}=${data[key]}`)
    .sort()
    .join("\n");

  const secretKey = await subtle.importKey(
    "raw",
    encoder.encode("WebAppData"),
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"]
  );
  const secret = await subtle.sign("HMAC", secretKey, encoder.encode(botToken));
  const signatureKey = await subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"]
  );
  const signature = await subtle.sign(
    "HMAC",
    signatureKey,
    encoder.encode(checkString)
  );

  // @ts-ignore
  const hex = [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return data.hash === hex;
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

  const valid = await validate(req.body, process.env.BOT_TOKEN || '')

  if (!valid) {
    res.status(400).json({ error: 'invalid telegram user!' })
    return
  }

  const { id, first_name, username, photo_url, auth_date } = req.body

  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: `TG-USER#${id}`,
        SK: `TG-USER#${id}`,
        first_name,
        photo_url,
        auth_date,
        update_at: Math.floor(new Date().getTime() / 1000),
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
