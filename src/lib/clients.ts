// src/lib/clients.ts
import Stripe from "stripe";
import { Resend } from "resend";

// Safe Stripe client factory
export function makeStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.warn("[makeStripe] STRIPE_SECRET_KEY not set.");
    return null;
  }
  return new Stripe(key, { apiVersion: "2023-10-16" });
}

// Safe Resend client factory
export function makeResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[makeResend] RESEND_API_KEY not set.");
    return null;
  }
  return new Resend(key);
}
