// src/emails/order-confirmation.ts
type Item = {
  name: string;
  quantity: number;
  unit_amount: number; // in minor units
  currency: string;
  description?: string;
  image?: string;
};

export function renderOrderEmail({
  deckName,
  orderId,
  total,
  currency,
  items,
  siteUrl,
}: {
  deckName: string;
  orderId: string;
  total: number;
  currency: string;
  items: Item[];
  siteUrl: string;
}) {
  const money = (cents: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
      (cents || 0) / 100
    );

  const rows = items
    .map(
      (i) => `
      <tr style="border-bottom:1px solid #27272a">
        <td style="padding:8px 12px; display:flex; align-items:center; gap:8px;">
          ${
            i.image
              ? `<img src="${i.image}" alt="" width="40" height="56" style="object-fit:cover;border-radius:6px;border:1px solid #3f3f46"/>`
              : `<div style="width:40px;height:56px;background:#27272a;border-radius:6px;border:1px solid #3f3f46"></div>`
          }
          <div>
            <div style="font-weight:600;color:#e4e4e7">${i.name}</div>
            ${
              i.description
                ? `<div style="font-size:12px;color:#a1a1aa">${i.description}</div>`
                : ""
            }
          </div>
        </td>
        <td style="padding:8px 12px;color:#d4d4d8;text-align:center">x${i.quantity}</td>
        <td style="padding:8px 12px;font-weight:600;color:#e4e4e7;text-align:right">${money(
          (i.unit_amount || 0) * (i.quantity || 1)
        )}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="background:#09090b;color:#e4e4e7;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#0b0b0f;border:1px solid #27272a;border-radius:16px;overflow:hidden">
      <div style="padding:20px 20px 0">
        <h1 style="margin:0 0 8px;font-size:20px;color:#86efac">✅ Payment Successful</h1>
        <p style="margin:0 0 4px;color:#d4d4d8">Thanks for your order! Your deck is on its way.</p>
        <p style="margin:0 0 12px;color:#a1a1aa;font-size:12px">Order ID: ${orderId}</p>
      </div>

      <div style="padding:0 20px 20px">
        <div style="background:#111113;border:1px solid #27272a;border-radius:12px;overflow:hidden">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #27272a">
            <div>
              <div style="font-weight:700">${deckName}</div>
              <div style="font-size:12px;color:#a1a1aa">Deck summary</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700">${money(total)}</div>
              <div style="font-size:12px;color:#a1a1aa">Total</div>
            </div>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div style="text-align:center;margin-top:16px">
          <a href="${siteUrl}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:600">View Deck Online</a>
        </div>

        <p style="color:#a1a1aa;font-size:12px;margin-top:16px">
          You are receiving this email because you made a purchase at MTG Deckbuilder.
          If you have questions, reply to this email.
        </p>
      </div>
    </div>
  </div>`;
}
