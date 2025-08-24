// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const resend = new Resend(process.env.RESEND_API_KEY);

// ❗ Disable automatic body parsing (needed for Stripe)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ Checkout complete:", session.id);

      // Example: sending confirmation email
      if (session.customer_details?.email) {
        await resend.emails.send({
          from: "MTG Deckbuilder <orders@yourdomain.com>",
          to: session.customer_details.email,
          subject: "Your MTG Deckbuilder Order Confirmation",
          html: `
            <h2>Thanks for your order!</h2>
            <p>Your deck has been successfully purchased.</p>
            <p>Order ID: ${session.id}</p>
            <p>You’ll receive shipping info soon.</p>
          `,
        });

        console.log("📧 Email sent to:", session.customer_details.email);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Error handling webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
