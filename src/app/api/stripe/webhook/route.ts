// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    const buf = await req.text();
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const deck = session.metadata?.deck || "No deck list provided";
      const shipping = session.customer_details
        ? `${session.customer_details.name}, ${session.customer_details.email}, ${session.customer_details.address?.line1}, ${session.customer_details.address?.city}`
        : "No shipping info";

      await resend.emails.send({
        from: "orders@yourdomain.com", // ⚠️ change this
        to: "youremail@example.com",   // ⚠️ your real email
        subject: "New Deck Order 🚀",
        html: `
          <h2>New Deck Order</h2>
          <p><strong>Deck List:</strong></p>
          <pre>${deck}</pre>
          <p><strong>Shipping Details:</strong></p>
          <p>${shipping}</p>
        `,
      });

      console.log("✅ Order email sent!");
    } catch (e: any) {
      console.error("❌ Failed to send email:", e.message);
    }
  }

  return NextResponse.json({ received: true });
}
