import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.body);
    res.status(200).json({
      status: 'ok',
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({status: 'error'});
  }
}