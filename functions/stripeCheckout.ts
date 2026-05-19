export default async function handler(req: Request) {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return Response.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const { items, customerEmail, customerName, orderNumber } = await req.json();
  const origin = req.headers.get("origin") ?? "https://app.base44.com";
  const safeOrder = String(orderNumber ?? "LM000000");

  const allItems = Array.isArray(items) ? [...items] : [];
  const subtotal = allItems.reduce((s: number, i: any) => s + Number(i.price) * (Number(i.quantity) || 1), 0);
  if (subtotal < 50) allItems.push({ name: "Standard Shipping", price: 6.99, quantity: 1 });

  const fd = new URLSearchParams();
  fd.append("mode", "payment");
  fd.append("payment_method_types[]", "card");
  fd.append("allow_promotion_codes", "true");
  fd.append("billing_address_collection", "required");
  fd.append("shipping_address_collection[allowed_countries][]", "US");
  fd.append("shipping_address_collection[allowed_countries][]", "CA");
  fd.append("shipping_address_collection[allowed_countries][]", "GB");
  fd.append("metadata[order_number]", safeOrder);
  fd.append("metadata[customer_name]", String(customerName ?? ""));
  fd.append("success_url", `${origin}/order-confirmation?order=${safeOrder}&session_id={CHECKOUT_SESSION_ID}`);
  fd.append("cancel_url", `${origin}/checkout`);
  if (customerEmail) fd.append("customer_email", String(customerEmail));

  allItems.forEach((item: any, idx: number) => {
    fd.append(`line_items[${idx}][price_data][currency]`, "usd");
    fd.append(`line_items[${idx}][price_data][product_data][name]`, String(item.name));
    fd.append(`line_items[${idx}][price_data][unit_amount]`, String(Math.round(Number(item.price) * 100)));
    fd.append(`line_items[${idx}][quantity]`, String(Number(item.quantity) || 1));
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: fd.toString(),
  });

  const data = await res.json() as any;
  if (!res.ok) return Response.json({ error: data?.error?.message ?? "Stripe error" }, { status: res.status });
  return Response.json({ url: data.url, sessionId: data.id });
}
