// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
import { Resend } from "resend";
import { renderOrderEmail } from "../../../../emails/order-confirmation";

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

      // Retrieve full session with line items (the event doesn't include them)
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      });

      const items = (fullSession.line_items?.data || []).map((li) => {
        const price = li.price as Stripe.Price | null;
        const product = (price?.product as Stripe.Product) || null;
        const image =
          (product?.images && product.images[0]) ||
          undefined;

        return {
          name: product?.name || li.description || "Card",
          quantity: li.quantity || 1,
          unit_amount: price?.unit_amount || 0,
          currency: (price?.currency || fullSession.currency || "gbp").toUpperCase(),
          description: product?.description || li.description || "",
          image,
        };
      });

      const emailHtml = renderOrderEmail({
        deckName: (fullSession.metadata && fullSession.metadata["deckName"]) || "Deck",
        orderId: fullSession.id,
        total: fullSession.amount_total || 0,
        currency: (fullSession.currency || "gbp").toUpperCase(),
        items,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
      });

      const to = fullSession.customer_details?.email;
      const from = process.env.RESEND_FROM || "no-reply@resend.dev";

      if (to) {
        await resend.emails.send({
          from,
          to,
          subject: "Your MTG Deckbuilder Order Confirmation",
          html: emailHtml,
        });
        console.log("📧 Email sent to:", to);
      } else {
        console.warn("⚠️ No customer email on session", fullSession.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Error handling webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
