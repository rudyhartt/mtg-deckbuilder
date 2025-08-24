// src/lib/mailer.ts

export type OrderEmailData = {
  to: string;
  subject: string;
  deck: any[];
  shipping?: Record<string, string>;
};

/**
 * Dummy sendOrderEmail function.
 * - If RESEND_API_KEY is missing → log email content instead of sending.
 * - If RESEND_API_KEY is present → TODO: wire up to Resend API.
 */
export async function sendOrderEmail(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ No RESEND_API_KEY found. Email sending is disabled.");
    console.log("📧 Email content (demo):", JSON.stringify(data, null, 2));
    return { demo: true };
  }

  // TODO: Replace this with real Resend integration once key is added.
  // Example (after `npm install resend`):
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "orders@yourdomain.com",
  //   to: data.to,
  //   subject: data.subject,
  //   html: `<pre>${JSON.stringify(data.deck, null, 2)}</pre>`
  // });

  return { sent: true };
}
