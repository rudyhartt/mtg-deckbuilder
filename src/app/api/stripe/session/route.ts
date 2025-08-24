// src/app/api/stripe/session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

// GET /api/stripe/session?session_id=cs_test_123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id") || searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Retrieve session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    // Shape a safe payload for the client
    const items = (session.line_items?.data || []).map((li) => {
      const price = li.price as Stripe.Price | null;
      // Product information may be expanded; if not, fallback to description
      const product = (price?.product as Stripe.Product) || null;
      const image =
        (product?.images && product.images[0]) ||
        undefined;

      return {
        id: li.id,
        name: product?.name || li.description || "Card",
        quantity: li.quantity || 1,
        unit_amount: price?.unit_amount || 0,
        currency: (price?.currency || session.currency || "gbp").toUpperCase(),
        description: product?.description || li.description || "",
        image,
      };
    });

    const payload = {
      id: session.id,
      customer_email: session.customer_details?.email || null,
      amount_total: session.amount_total || 0,
      currency: (session.currency || "gbp").toUpperCase(),
      deckName: (session.metadata && session.metadata["deckName"]) || "Deck",
      items,
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("❌ Error retrieving session:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
