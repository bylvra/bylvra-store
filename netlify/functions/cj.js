const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";
const CJ_EMAIL = "contact@bylvra.shop";
const CJ_KEY = "CJ5434554@api@d32a35af438a4248887d505145005ef1";

async function getCJToken() {
  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CJ_EMAIL, password: CJ_KEY }),
  });
  const data = await res.json();
  if (!data.result) throw new Error("CJ auth failed: " + data.message);
  return data.data.accessToken;
}

exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: corsHeaders, body: "" };

  try {
    const params = event.queryStringParameters || {};
    const action = params.action || "search";
    const token = await getCJToken();

    // ── SEARCH ──────────────────────────────────────────────────────────────
    if (action === "search") {
      const keyword = params.keyword || "skincare";
      const page = params.page || "1";
      const size = params.size || "20";
      const qs = new URLSearchParams({ keyWord: keyword, page, size });
      const res = await fetch(`${CJ_BASE}/product/listV2?${qs}`, {
        headers: { "CJ-Access-Token": token },
      });
      const data = await res.json();
      if (!data.result) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: data.message }) };
      const raw = data.data?.content?.[0]?.productList || [];
      const products = raw.map(p => ({
        cjId: p.id, sku: p.sku, name: p.nameEn, image: p.bigImage,
        sellPrice: p.sellPrice, nowPrice: p.nowPrice,
        category: p.threeCategoryName || p.twoCategoryName || p.oneCategoryName,
        freeShipping: p.addMarkStatus === 1, inventory: p.warehouseInventoryNum,
      }));
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ products, total: data.data?.totalRecords }) };
    }

    // ── PRODUCT DETAIL ───────────────────────────────────────────────────────
    if (action === "detail") {
      const pid = params.pid;
      if (!pid) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "pid required" }) };
      const res = await fetch(`${CJ_BASE}/product/query?pid=${pid}`, { headers: { "CJ-Access-Token": token } });
      const data = await res.json();
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(data.data || {}) };
    }

    // ── AUTO-ORDER: place a fulfillment order with CJ ────────────────────────
    if (action === "autoOrder") {
      if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "POST required" }) };
      }

      const body = JSON.parse(event.body || "{}");
      const { orderNumber, shippingAddress, items } = body;

      if (!orderNumber || !shippingAddress || !items?.length) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "orderNumber, shippingAddress, and items required" }) };
      }

      // Build CJ order payload
      const cjProducts = items
        .filter(i => i.cjSku) // only items that were imported from CJ (have a CJ SKU)
        .map(i => ({ vid: i.cjSku, quantity: i.quantity }));

      if (!cjProducts.length) {
        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ skipped: true, reason: "No CJ SKUs found on order items" }) };
      }

      const cjOrder = {
        orderNumber,
        shippingCountryCode: shippingAddress.countryCode || "US",
        shippingCountry: shippingAddress.country || "United States",
        shippingProvince: shippingAddress.state || "",
        shippingCity: shippingAddress.city || "",
        shippingAddress: shippingAddress.line1 || "",
        shippingAddress2: shippingAddress.line2 || "",
        shippingZip: shippingAddress.zip || "",
        shippingCustomerName: shippingAddress.name || "",
        shippingPhone: shippingAddress.phone || "",
        products: cjProducts,
        logisticsName: "CJPacket",
        remark: `BYLVRA order ${orderNumber}`,
      };

      const res = await fetch(`${CJ_BASE}/shopping/order/createOrderV2`, {
        method: "POST",
        headers: { "CJ-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify(cjOrder),
      });
      const data = await res.json();

      if (!data.result) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: data.message, cjCode: data.code }) };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, cjOrderId: data.data?.orderId, cjOrderNumber: data.data?.orderNum }),
      };
    }

    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Unknown action" }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
