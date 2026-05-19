import process from "node:process";

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

async function getCJToken(): Promise<string> {
  const email = process.env.CJ_API_EMAIL;
  const password = process.env.CJ_API_KEY;
  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.result) throw new Error("CJ auth failed: " + data.message);
  return data.data.accessToken;
}

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { headers });

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "search";
    const token = await getCJToken();

    // --- SEARCH PRODUCTS ---
    if (action === "search") {
      const keyword = url.searchParams.get("keyword") || "skincare";
      const page = url.searchParams.get("page") || "1";
      const size = url.searchParams.get("size") || "20";

      const params = new URLSearchParams({
        keyWord: keyword,
        page,
        size,
      });

      const res = await fetch(`${CJ_BASE}/product/listV2?${params}`, {
        headers: { "CJ-Access-Token": token },
      });
      const data = await res.json();

      if (!data.result) {
        return new Response(JSON.stringify({ error: data.message }), { status: 400, headers });
      }

      const rawProducts = data.data?.content?.[0]?.productList || [];
      const products = rawProducts.map((p: any) => ({
        cjId: p.id,
        sku: p.sku,
        name: p.nameEn,
        image: p.bigImage,
        sellPrice: p.sellPrice,
        nowPrice: p.nowPrice,
        category: p.threeCategoryName || p.twoCategoryName || p.oneCategoryName,
        freeShipping: p.addMarkStatus === 1,
        inventory: p.warehouseInventoryNum,
      }));

      return new Response(JSON.stringify({ products, total: data.data?.totalRecords }), { headers });
    }

    // --- GET PRODUCT DETAILS ---
    if (action === "detail") {
      const pid = url.searchParams.get("pid");
      if (!pid) return new Response(JSON.stringify({ error: "pid required" }), { status: 400, headers });

      const res = await fetch(`${CJ_BASE}/product/query?pid=${pid}`, {
        headers: { "CJ-Access-Token": token },
      });
      const data = await res.json();
      return new Response(JSON.stringify(data.data || {}), { headers });
    }

    // --- IMPORT PRODUCT TO STORE ---
    if (action === "import" && req.method === "POST") {
      const body = await req.json();
      const { cjId, sku, name, image, sellPrice, category } = body;

      // Get full product details
      const detailRes = await fetch(`${CJ_BASE}/product/query?pid=${cjId}`, {
        headers: { "CJ-Access-Token": token },
      });
      const detailData = await detailRes.json();
      const detail = detailData.data || {};

      // Parse price (can be a range like "1.00 -- 5.00", take the lower)
      const priceStr = String(sellPrice || "0").split("--")[0].trim();
      const costPrice = parseFloat(priceStr) || 0;
      const retailPrice = parseFloat((costPrice * 3).toFixed(2)); // 3x markup
      const comparePrice = parseFloat((retailPrice * 1.3).toFixed(2));

      // Build slug
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60) + "-" + Date.now().toString(36);

      // Map CJ category to BYLVRA category
      const catLower = (category || "").toLowerCase();
      let bylvraCategory = "Skincare";
      if (catLower.includes("hair") || catLower.includes("scalp")) bylvraCategory = "Hair Care";
      else if (catLower.includes("body") || catLower.includes("lotion") || catLower.includes("massage")) bylvraCategory = "Body";
      else if (catLower.includes("device") || catLower.includes("tool") || catLower.includes("massager") || catLower.includes("roller")) bylvraCategory = "Tools & Devices";
      else if (catLower.includes("supplement") || catLower.includes("vitamin") || catLower.includes("health")) bylvraCategory = "Supplements";

      // Build images array
      const images = detail.productImageSet
        ? detail.productImageSet.map((img: any) => img.imageUrl).filter(Boolean)
        : [image];
      if (images.length === 0) images.push(image);

      // Build product record
      const product = {
        name,
        slug,
        category: bylvraCategory,
        price: retailPrice,
        compare_at_price: comparePrice,
        description: detail.description || detail.productNameEn || name,
        short_description: `${name} — sourced from CJ Dropshipping.`,
        images,
        badge: "NEW",
        rating: 4.5,
        review_count: 0,
        ingredients: "",
        benefits: [],
        whats_in_box: `${name} × 1`,
        in_stock: true,
        stock_count: detail.inventoryQuantity || 99,
        variants: [],
        tags: [bylvraCategory.toLowerCase(), "cj-dropshipping"],
        frequently_bought_with: [],
        cj_sku: sku,
        cj_id: cjId,
      };

      // Save to Base44 entity
      const serviceToken = process.env.BASE44_SERVICE_TOKEN;
      const saveRes = await fetch(
        `https://app.base44.app/api/apps/6a0bd6cb3aacbe39bd424575/entities/Product`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${serviceToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      const saved = await saveRes.json();
      return new Response(JSON.stringify({ success: true, product: saved }), { headers });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
