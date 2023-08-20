import auth0Management from "@/utils/auth0Management";
import {NextApiRequest, NextApiResponse} from "next";
import Stripe from "stripe";
import stripeClient from "@/utils/stripeClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
      const body = await buffer(req);
      event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session;
      const {metadata, payment_status} = checkoutSessionCompleted;
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
      } else {
        console.log("no paid!")
      }
    }

    res.status(200).json({received: true});
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};