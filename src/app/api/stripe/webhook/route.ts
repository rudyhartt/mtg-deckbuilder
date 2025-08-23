import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia", // or the latest supported
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerName = session.metadata?.customer_name;
      const customerAddress = session.metadata?.customer_address;
      const deck = session.metadata?.deck;
      const email = session.customer_email;

      // Send YOU an email with the order details
      await resend.emails.send({
        from: "orders@yourdomain.com", // configure this in Resend
        to: "your-email@example.com",  // <-- your personal email
        subject: `New Deck Order from ${customerName}`,
        text: `
A new order has been placed!

Customer: ${customerName}
Email: ${email}
Address: ${customerAddress}

Deck:
${deck}
        `,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
