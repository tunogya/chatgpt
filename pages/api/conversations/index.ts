import {NextApiRequest, NextApiResponse} from 'next';

// GET conversations?offset=0&limit=20
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const offset = req.query?.offset || 0;
    const limit = req.query?.limit || 20;

    return;
  }
  else if (req.method === 'POST') {
    const {action, conversation_id, messages, model, parent_message_id} = req.body;

    return;
  }

}

// {'items':[
// {'id':'edfc6efa-9816-4730-98f5-82a26d088eb0',
// 'title':'Hello, how can I assist you? - Assistance Requested',
// 'create_time':'2023-02-14T07:49:04.579497'}],
// 'total':8,'limit':20,'offset':0}