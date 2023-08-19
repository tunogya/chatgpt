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
        console.log(metadata,  payment_status)
        // payment_status - paid, unpaid, refunded
        if (payment_status === 'paid') {
          if (metadata) {
            try {
              const auth0Metadata = JSON.parse(metadata.metadata);
              await auth0Management.updateAppMetadata({id: metadata.id}, {
                ...auth0Metadata,
              })
              console.log('metadata updated', metadata)
            } catch (e) {
              console.log(e)
            }
          }
        }
        break;
      default:
        break;
    }
    res.status(200);
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}