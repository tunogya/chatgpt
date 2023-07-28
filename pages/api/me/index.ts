import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import auth0Management from "@/utils/auth0Management";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const {user} = await getSession(req, res);
  const info = await auth0Management.getUser({
    id: user.sub,
  })
  res.status(200).json({
    ...info
  })
})