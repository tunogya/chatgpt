import {NextApiRequest, NextApiResponse} from 'next';
import {withApiAuthRequired} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }
  const {input} = req.body;
  if (!input) {
    res.status(400).json({error: 'Input is required'});
    return;
  }

  try {
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
    const flagged = response.results?.[0]?.flagged;
    const blocked = Object.values(response.results?.[0]?.categories).reduce((acc, curr) => acc || curr);
    res.status(200).json({
      service: 'openai',
      flagged,
      blocked,
    });
  } catch (e) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});