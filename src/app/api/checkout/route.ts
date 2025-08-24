// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Example: body should contain deck items
    const { items } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "gbp",
          unit_amount: 50, // 50p per card
          product_data: {
            name: item.name,
            description: `${item.set} #${item.collector_number} (${item.rarity})`,
            images: item.image_uris?.normal ? [item.image_uris.normal] : [],
          },
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        deckName: body.deckName || "Untitled Deck",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Checkout error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
