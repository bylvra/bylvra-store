import { useEffect } from 'react';

export default function SEO({ title, description, image, url, type = 'website' }) {
  useEffect(() => {
    const siteTitle = 'BYLVRA';
    const fullTitle = title ? `${title} — ${siteTitle}` : `${siteTitle} — Clinically Formulated Skincare & Beauty Devices`;
    const desc = description || 'Clinical-grade skincare and beauty devices. Visible results in 28 days. LED masks, microcurrent, peptide serums and more.';
    const img = image || 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?w=1200&h=630&fit=crop';
    const pageUrl = url || window.location.href;

    document.title = fullTitle;

    const setMeta = (selector, attr, val) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('[', '').replace(']', '').split('=');
        el.setAttribute(attrName.replace('meta[', ''), attrVal.replace(/"/g, ''));
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
  }, [title, description, image, url]);

  return null;
}
