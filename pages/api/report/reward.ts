import {withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

})