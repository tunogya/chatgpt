import {NextApiRequest, NextApiResponse} from 'next'

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');

  for (let i = 0; i <= 5; i++) {
    if (i === 5) {
      res.write('data: [DONE]\n\n')
    } else {
      res.write(`data: ${JSON.stringify({
        number: i
      })}\n\n`)
    }
    await sleep(1000);
  }
  res.end('done\n');
};

export default handler;