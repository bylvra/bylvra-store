import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") ?? "";
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

    // Parse the event (skip signature verification if no secret set yet)
    let event: any;
    if (webhookSecret) {
      // Verify signature using Stripe's algorithm
      const parts = sig.split(",").reduce((acc: any, part) => {
        const [k, v] = part.split("=");
        acc[k] = v;
        return acc;
      }, {});
      const timestamp = parts["t"];
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw", encoder.encode(webhookSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
      );
      const signedPayload = `${timestamp}.${body}`;
      const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
      const hex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");
      const expectedSig = parts["v1"];
      if (hex !== expectedSig) {
        return Response.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderNumber = session.metadata?.order_number;
      const customerEmail = session.customer_details?.email ?? session.customer_email;
      const customerName = session.customer_details?.name ?? session.metadata?.customer_name ?? "";

      if (orderNumber) {
        // Find and update the order to paid
        const orders = await base44.asServiceRole.entities.Order.filter({ order_number: orderNumber });
        if (orders?.length > 0) {
          const order = orders[0];
          await base44.asServiceRole.entities.Order.update(order.id, {
            payment_status: "paid",
            status: "processing",
          });

          // Send confirmation email to customer
          if (customerEmail) {
            try {
              const items = order.items ?? [];
              const subtotal = order.subtotal ?? 0;
              const shippingCost = order.shipping_cost ?? 0;
              const total = order.total ?? 0;

              // Call sendOrderConfirmation function
              const emailRes = await fetch(`${new URL(req.url).origin}/functions/sendOrderConfirmation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderNumber, customerEmail, customerName, items, subtotal, shippingCost, total }),
              });
              const emailData = await emailRes.json();
              console.log("Email result:", JSON.stringify(emailData));
            } catch (emailErr: any) {
              console.error("Email send failed:", emailErr.message);
            }
          }
        }
      }
    }

    return Response.json({ received: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
