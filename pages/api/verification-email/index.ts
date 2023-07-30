import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import auth0Management from "@/utils/auth0Management";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const {user} = await getSession(req, res);
  try {
    const result = await auth0Management.sendEmailVerification({
      user_id: user.sub,
    })
    res.status(200).json({
      ...result
    })
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
})