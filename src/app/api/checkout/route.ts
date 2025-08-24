// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // In production, you'd read from req.json() and forward to Stripe.
    const body = await req.json();

    // If Stripe key is missing, return a dummy success response
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("⚠️ No STRIPE_SECRET_KEY found. Returning dummy URL.");
      return NextResponse.json({
        url: "/success?demo=1", // Pretend checkout succeeded
      });
    }

    // TODO: Replace with real Stripe Checkout session creation later
    // Example:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
    // const session = await stripe.checkout.sessions.create({ ... });
    // return NextResponse.json({ url: session.url });

    return NextResponse.json({
      url: "/success?demo=1", // placeholder redirect
    });
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
