import { createClientFromRequest } from "npm:@base44/sdk";

export default async function handler(req: Request) {
  const body = await req.json();
  const { orderNumber, customerEmail, customerName, items, subtotal, shippingCost, total } = body;

  if (!customerEmail) {
    return Response.json({ error: "No customer email" }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);
  const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");

  const firstName = (customerName ?? "").split(" ")[0] || "there";
  const estimatedDelivery = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const itemRows = (items ?? []).map((item: any) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;">
        <span style="font-size:14px;font-weight:600;color:#1A1A1A;">${item.name}</span><br>
        <span style="font-size:12px;color:#888;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;text-align:right;font-size:14px;font-weight:600;color:#1A1A1A;">
        $${(Number(item.price) * Number(item.quantity)).toFixed(2)}
      </td>
    </tr>`).join("");

  const shippingLabel = Number(shippingCost) === 0 ? "FREE" : `$${Number(shippingCost).toFixed(2)}`;
  const shippingColor = Number(shippingCost) === 0 ? "#2D9E6B" : "#888";

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F8F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F8F8;padding:40px 20px;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">

<tr><td style="background:#1A1A1A;padding:32px 40px;text-align:center;">
  <span style="font-size:24px;font-weight:800;letter-spacing:4px;color:#FFFFFF;">LUMARA</span>
  <p style="color:#B8E0D2;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin:8px 0 0;">Order Confirmed</p>
</td></tr>

<tr><td style="padding:40px 40px 24px;text-align:center;border-bottom:1px solid #F0F0F0;">
  <h1 style="font-size:22px;font-weight:700;color:#1A1A1A;margin:0 0 8px;">Thank you, ${firstName}!</h1>
  <p style="font-size:15px;color:#666;margin:0 0 20px;">Your order has been received and is being prepared.</p>
  <div style="display:inline-block;background:#F8F4F8;border-radius:8px;padding:12px 28px;">
    <span style="font-size:11px;color:#888;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:4px;">Order Number</span>
    <span style="font-size:20px;font-weight:800;color:#1A1A1A;letter-spacing:2px;">${orderNumber}</span>
  </div>
</td></tr>

<tr><td style="padding:32px 40px;">
  <p style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1A1A1A;margin:0 0 16px;">Your Items</p>
  <table width="100%" cellpadding="0" cellspacing="0">
    ${itemRows}
    <tr><td colspan="2" style="padding-top:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#888;padding:4px 0;">Subtotal</td>
          <td style="font-size:13px;color:#888;text-align:right;">$${Number(subtotal).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:${shippingColor};padding:4px 0;">Shipping</td>
          <td style="font-size:13px;color:${shippingColor};text-align:right;font-weight:600;">${shippingLabel}</td>
        </tr>
        <tr>
          <td style="font-size:16px;font-weight:800;color:#1A1A1A;padding:14px 0 0;border-top:1.5px solid #E0E0E0;">Total</td>
          <td style="font-size:16px;font-weight:800;color:#1A1A1A;text-align:right;padding:14px 0 0;border-top:1.5px solid #E0E0E0;">$${Number(total).toFixed(2)}</td>
        </tr>
      </table>
    </td></tr>
  </table>
</td></tr>

<tr><td style="padding:0 40px 32px;">
  <div style="background:#F0FAF6;border-radius:10px;padding:20px 24px;border-left:3px solid #B8E0D2;">
    <p style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#2D9E6B;margin:0 0 4px;">Estimated Delivery</p>
    <p style="font-size:16px;font-weight:700;color:#1A1A1A;margin:0 0 6px;">${estimatedDelivery}</p>
    <p style="font-size:12px;color:#666;margin:0;">Processing 1–3 days · Standard shipping 7–12 days. Tracking info will be sent once your order ships.</p>
  </div>
</td></tr>

<tr><td style="padding:24px 40px;background:#FAFAFA;border-top:1px solid #F0F0F0;text-align:center;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="text-align:center;"><p style="margin:0 0 6px;font-size:18px;">🔒</p><p style="font-size:11px;font-weight:600;color:#1A1A1A;margin:0;">Secure Payment</p></td>
    <td style="text-align:center;"><p style="margin:0 0 6px;font-size:18px;">↩️</p><p style="font-size:11px;font-weight:600;color:#1A1A1A;margin:0;">30-Day Returns</p></td>
    <td style="text-align:center;"><p style="margin:0 0 6px;font-size:18px;">💬</p><p style="font-size:11px;font-weight:600;color:#1A1A1A;margin:0;">24/7 Support</p></td>
  </tr></table>
</td></tr>

<tr><td style="padding:28px 40px;text-align:center;border-top:1px solid #F0F0F0;">
  <p style="font-size:12px;color:#AAA;margin:0 0 6px;">Questions? Contact us at support@lumara.com</p>
  <p style="font-size:11px;color:#CCC;margin:0;">© 2026 Lumara Beauty. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  const subject = `Order Confirmed — ${orderNumber} | LUMARA`;
  const mime = [`From: LUMARA Beauty <me>`, `To: ${customerEmail}`, `Subject: ${subject}`, `MIME-Version: 1.0`, `Content-Type: text/html; charset=UTF-8`, ``, html].join("\r\n");
  const encoded = btoa(unescape(encodeURIComponent(mime))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: encoded }),
  });

  const gmailData = await gmailRes.json() as any;
  if (!gmailRes.ok) return Response.json({ error: gmailData?.error?.message ?? "Gmail send failed" }, { status: gmailRes.status });
  return Response.json({ success: true, messageId: gmailData.id });
}
