import {NextApiRequest, NextApiResponse} from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {line_items, mode, customer_email, metadata} = req.body;
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: mode,
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        automatic_tax: {enabled: true},
        customer_email: customer_email || undefined,
        metadata: metadata || undefined,
      });
      res.status(200).json(session)
    } catch (err: any) {
      res.status(err?.statusCode || 500).json(err?.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}