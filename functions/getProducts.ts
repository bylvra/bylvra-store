import process from "node:process";

const APP_ID = "6a0bd6cb3aacbe39bd424575";
const API_BASE = "https://app.base44.app/api/apps";

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { headers });

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    const serviceToken = process.env.BASE44_SERVICE_TOKEN;

    const res = await fetch(
      `${API_BASE}/${APP_ID}/entities/Product/records?limit=200`,
      {
        headers: {
          "Authorization": `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: res.status, headers });
    }

    const data = await res.json();
    const products = Array.isArray(data) ? data : (data.records || []);

    const filtered = category
      ? products.filter((p: any) => p.category === category)
      : products;

    return new Response(JSON.stringify(filtered), { headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
