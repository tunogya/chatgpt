import {NextApiRequest, NextApiResponse} from "next";
import auth0Management from "@/utils/auth0Management";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // get headers stripe-signature
    const signature = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        const { metadata, payment_status} =  checkoutSessionCompleted;
        if (payment_status === 'paid') {
          if (metadata) {
            try {
              const auth0Metadata = metadata.medadata;
              await auth0Management.updateAppMetadata({id: metadata.id}, {
                ...auth0Metadata,
              })
            } catch (e) {
              console.log(e)
            }
          }
        }
        break;
      default:
        break;
    }

  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}