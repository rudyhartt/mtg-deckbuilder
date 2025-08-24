// src/app/api/stripe/webhook/route.ts
import type Stripe from "stripe";
import { makeStripe, makeResend } from "../../../lib/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = makeStripe();

  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    console.warn("[webhook] Stripe not configured. Skipping.");
    return new Response("Stripe not configured", { status: 200 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[webhook] Signature check failed:", err?.message);
    return new Response(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const resend = makeResend();
      if (!resend) {
        console.warn("[webhook] RESEND_API_KEY not set. Skipping email.");
      } else {
        await resend.emails.send({
          from: "orders@your-domain.com",
          to: "customer@example.com",
          subject: "Your MTG Deck Order",
          html: `<p>Thanks for your order!</p>`,
        });
      }
    } catch (e) {
      console.error("[webhook] Error during email send:", e);
    }
  }

  return new Response("ok", { status: 200 });
}
