import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICE_PER_CARD } from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { deck, customer } = await req.json();

    if (!deck || deck.length === 0) {
      return NextResponse.json({ error: "No deck provided" }, { status: 400 });
    }

    const lineItems = deck.map((it: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: it.name,
        },
        unit_amount: PRICE_PER_CARD, // 50p per card
      },
      quantity: it.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_address: customer.address,
        deck: JSON.stringify(deck),
      },
      // ✅ Redirect URLs
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
