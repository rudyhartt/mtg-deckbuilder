// src/app/api/checkout/route.ts
import { makeStripe } from "../../../../lib/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = makeStripe();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const body = await req.json().catch(() => ({}));
  const line_items = Array.isArray(body?.line_items) ? body.line_items : undefined;

  if (!stripe) {
    console.warn("[checkout] Running in demo mode, Stripe not configured.");
    return Response.json({
      url: `${BASE_URL}/success?demo=1`,
      demo: true,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items:
      line_items?.length
        ? line_items
        : [
            {
              price_data: {
                currency: "gbp",
                product_data: { name: "Deck Cards" },
                unit_amount: 50, // £0.50
              },
              quantity: 1,
            },
          ],
    success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/cancel`,
  });

  return Response.json({ url: session.url });
}
