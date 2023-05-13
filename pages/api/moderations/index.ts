import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }
  const { input } = req.body;
  if (!input) {
    res.status(400).json({error: 'Input is required'});
  }
  const request = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_SECRET ?? ''}`,
    },
    body: JSON.stringify({
      input,
      model: 'text-moderation-latest',
    })
  })
  const response = await request.json();
  const flagged = response?.results?.[0]?.flagged;
  const blocked = Object.values(response?.results?.[0]?.categories).reduce((acc, curr) => acc || curr);
  res.status(200).json({
    id: response.id,
    model: response.model,
    flagged,
    blocked
  });
}