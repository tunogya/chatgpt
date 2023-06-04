import {withApiAuthRequired} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // request
  // {
  //     "current_node_id": "20617eb9-8853-42d8-8b0c-1627a70a670d",
  //     "conversation_id": "ad2bc389-5e96-4846-a1bd-f963692ec730",
  //     "is_anonymous": true
  // }
  const {current_node_id, conversation_id, is_anonymous} = req.body;

  // return
  // {"share_id":"34c27a3c-64c8-442e-bff3-b675de57b885",
  // "share_url":"https://chat.openai.com/share/34c27a3c-64c8-442e-bff3-b675de57b885",
  // "title":"Requesting Conversation Summary.",
  // "is_public":true,
  // "is_visible":true,
  // "is_anonymous":true,
  // "highlighted_message_id":null,
  // "current_node_id":"20617eb9-8853-42d8-8b0c-1627a70a670d",
  // "already_exists":true,
  // "moderation_state":{"has_been_moderated":false,
  //    "has_been_blocked":false,
  //    "has_been_accepted":false,
  //    "has_been_auto_blocked":false,
  //    "has_been_auto_moderated":false
  // }}
});