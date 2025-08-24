// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // In real mode, Stripe would send signed events here.
    // For now, just pretend we got one and acknowledge it.

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn("⚠️ No STRIPE_WEBHOOK_SECRET found. Running in demo mode.");
      return NextResponse.json({ received: true, demo: true });
    }

    // TODO: Replace with real Stripe webhook verification logic later
    // Example (when keys available):
    // const sig = req.headers.get("stripe-signature")!;
    // const buf = await req.text();
    // const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    // Handle event type...
    // return NextResponse.json({ received: true });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 400 }
    );
  }
}
