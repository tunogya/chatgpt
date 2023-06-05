import {withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import {DeleteCommand, GetCommand} from "@aws-sdk/lib-dynamodb";
import {ddbDocClient} from "@/utils/DynamoDB";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.query;
  // GET
  if (req.method === 'GET') {
    try {
      const data = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: id,
          SK: id,
        }
      }))
      if (data.Item) {
        res.status(200).json(data.Item)
      } else {
        res.status(404).json({error: 'No share found'})
      }
    } catch (e) {
      res.status(500).json({error: e})
    }
  }
  // DELETE
  else if (req.method === 'DELETE') {
    try {
      await ddbDocClient.send(new DeleteCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: id,
          SK: id,
        }
      }))
      res.status(200).json({message: 'Delete share'})
    } catch (e) {
      res.status(500).json({error: e})
      return;
    }
  }
  // PATCH
  else if (req.method === 'PATCH') {
    try {
      // TODO, PATCH share
    } catch (e) {
      res.status(500).json({error: e})
      return;
    }
  }
  else {
    res.status(500).json({error: "Only support GET, DELETE, PATCH method"})
  }
});