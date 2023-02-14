import {NextApiRequest, NextApiResponse} from 'next';

// GET conversations?offset=0&limit=20
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PATCH') {
    // is_visible: false


    // Return
    // success: true
  }
}