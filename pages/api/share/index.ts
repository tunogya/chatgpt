import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";
import {ddbDocClient} from "@/utils/DynamoDB";
import {GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from "uuid";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // @ts-ignore
    const {user} = await getSession(req, res);
    const user_id = user.sub;
    const {current_node_id, conversation_id, is_anonymous} = req.body;
    const conversationRes = await ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: conversation_id,
      }
    }))

    if (!conversationRes.Item) {
      res.status(404).json({error: 'No conversation found'})
      return;
    }

    if (conversationRes.Item.share_id) {
      const shareRes = await ddbDocClient.send(new GetCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: conversationRes.Item.share_id,
          SK: conversationRes.Item.share_id,
        }
      }))
      res.status(200).json({
        ...shareRes.Item,
        already_exists: true,
      })
      return;
    }

    const share_id = uuidv4()
    await ddbDocClient.send(new UpdateCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: conversation_id,
      },
      UpdateExpression: 'SET share_id = :share_id',
      ExpressionAttributeValues: {
        ':share_id': share_id,
      }
    }))

    await ddbDocClient.send(new PutCommand({
      TableName: 'wizardingpay',
      Item: {
        PK: share_id,
        SK: share_id,
        share_url: `https://www.abandon.chat/share/${share_id}`,
        title: conversationRes.Item.title,
        is_public: true,
        is_visible: true,
        is_anonymous,
        current_node_id,
        highlighted_message_id: null,
        mapping: conversationRes.Item.mapping,
        moderation_state: {
          "has_been_moderated": false,
          "has_been_blocked": false,
          "has_been_accepted": false,
          "has_been_auto_blocked": false,
          "has_been_auto_moderated": false,
        },
        created: Math.floor(Date.now() / 1000),
        // TODO: set TTL 7 days
        TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      }
    }))
    res.status(200).json({
      share_id,
      share_url: `https://www.abandon.chat/share/${share_id}`,
      title: conversationRes.Item.title,
      is_public: true,
      is_visible: true,
      is_anonymous,
      current_node_id,
      highlighted_message_id: null,
      already_exists: false,
      mapping: conversationRes.Item.mapping,
      created: Math.floor(Date.now() / 1000),
      moderation_state: {
        "has_been_moderated": false,
        "has_been_blocked": false,
        "has_been_accepted": false,
        "has_been_auto_blocked": false,
        "has_been_auto_moderated": false,
      },
    })
    return
  } else {
    res.status(500).json({"error": "bad request"})
  }
});