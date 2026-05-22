import { useEffect } from 'react';

export default function SEO({ title, description, image, url, type = 'website', product }) {
  useEffect(() => {
    const siteTitle = 'BYLVRA';
    const fullTitle = title ? `${title} — ${siteTitle}` : `${siteTitle} — Clinically Formulated Skincare & Beauty Devices`;
    const desc = description || 'Clinical-grade skincare and beauty devices. Visible results in 28 days.';
    const img = image || 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?w=1200&h=630&fit=crop';
    const pageUrl = url || window.location.href;

    document.title = fullTitle;

    const setMeta = (selector, attr, val) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.match(/\[(\w+[:\w]*)="([^"]+)"\]/);
        if (parts) { el.setAttribute(parts[1], parts[2]); }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:image"]', 'content', img);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', img);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = pageUrl;

    // Product structured data for Google rich results
    let ldScript = document.getElementById('bylvra-ld-json');
    if (product) {
      if (!ldScript) { ldScript = document.createElement('script'); ldScript.type = 'application/ld+json'; ldScript.id = 'bylvra-ld-json'; document.head.appendChild(ldScript); }
      ldScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description || desc,
        "image": product.images || [img],
        "brand": { "@type": "Brand", "name": "BYLVRA" },
        "offers": {
          "@type": "Offer",
          "url": pageUrl,
          "priceCurrency": "USD",
          "price": String(product.price),
          "availability": product.in_stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": "BYLVRA" }
        },
        ...(product.rating ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": String(product.rating),
            "reviewCount": String(product.review_count || 1),
            "bestRating": "5"
          }
        } : {})
      });
    } else if (ldScript) {
      ldScript.remove();
    }

    return () => {
      // Restore default title on unmount
      document.title = `${siteTitle} — Clinically Formulated Skincare & Beauty Devices`;
    };
  }, [title, description, image, url, product]);

  return null;
}
