import { useState } from 'react';
import { Search, Plus, CheckCircle, Loader, ExternalLink, Tag } from 'lucide-react';
import { Product } from '../api/entities';

const CJ_KEYWORDS = [
  'face serum', 'vitamin c serum', 'hyaluronic acid', 'retinol cream',
  'gua sha', 'jade roller', 'led face mask', 'microneedling',
  'hair growth serum', 'scalp massager', 'collagen', 'niacinamide',
  'eye cream', 'lip serum', 'body scrub', 'face mask',
];

const CATEGORY_MAP = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('hair') || c.includes('scalp')) return 'Hair Care';
  if (c.includes('body') || c.includes('lotion') || c.includes('massage')) return 'Body';
  if (c.includes('device') || c.includes('tool') || c.includes('massager') || c.includes('roller')) return 'Tools & Devices';
  if (c.includes('supplement') || c.includes('vitamin') || c.includes('health')) return 'Supplements';
  return 'Skincare';
};

export default function CJImporter() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});
  const [imported, setImported] = useState({});
  const [error, setError] = useState('');

  const searchCJ = async (kw) => {
    const q = kw || keyword;
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      // Use CJ API via proxy — falls back to direct fetch
      const res = await fetch(
        `/.netlify/functions/cj?action=search&keyword=${encodeURIComponent(q)}&size=20`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.products || []);
    } catch (err) {
      setError('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const importProduct = async (p) => {
    setImporting(prev => ({ ...prev, [p.cjId]: true }));
    try {
      const res = await fetch(
        `/.netlify/functions/cj?action=import`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImported(prev => ({ ...prev, [p.cjId]: true }));
    } catch (err) {
      // Fallback: import directly via Base44 SDK
      try {
        const priceStr = String(p.sellPrice || '0').split('--')[0].trim();
        const cost = parseFloat(priceStr) || 1;
        const retail = parseFloat((cost * 3).toFixed(2));
        const compare = parseFloat((retail * 1.3).toFixed(2));
        const slug = p.name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 60) + '-' + Date.now().toString(36);

        await Product.create({
          name: p.name,
          slug,
          category: CATEGORY_MAP(p.category),
          price: retail,
          compare_at_price: compare,
          description: p.name,
          short_description: `${p.name.slice(0, 80)}. Shipped via CJ Dropshipping.`,
          images: [p.image],
          badge: 'NEW',
          rating: 4.5,
          review_count: 0,
          ingredients: '',
          benefits: [],
          whats_in_box: `${p.name} × 1`,
          in_stock: true,
          stock_count: p.inventory || 99,
          variants: [],
          tags: [CATEGORY_MAP(p.category).toLowerCase(), 'cj-dropshipping'],
          frequently_bought_with: [],
        });
        setImported(prev => ({ ...prev, [p.cjId]: true }));
      } catch (e2) {
        setError('Import failed: ' + e2.message);
      }
    } finally {
      setImporting(prev => ({ ...prev, [p.cjId]: false }));
    }
  };

  const parsePrice = (price) => {
    if (!price) return '—';
    const str = String(price);
    if (str.includes('--')) {
      const [low, high] = str.split('--').map(s => parseFloat(s.trim()));
      return `$${low.toFixed(2)} – $${high.toFixed(2)}`;
    }
    return `$${parseFloat(str).toFixed(2)}`;
  };

  const suggestRetail = (price) => {
    if (!price) return '';
    const cost = parseFloat(String(price).split('--')[0].trim()) || 0;
    return `→ sell at $${(cost * 3).toFixed(2)}`;
  };

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#1A1A1A', color: '#fff', padding: '24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: '#FCE4EC', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={18} color="#1A1A1A" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>CJ Product Importer</h1>
              <p style={{ margin: 0, fontSize: 12, color: '#888', marginTop: 2 }}>Search CJ Dropshipping → import directly to BYLVRA</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Search bar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchCJ(keyword)}
                placeholder="Search CJ catalog… e.g. vitamin c serum, jade roller, hair mask"
                style={{
                  width: '100%', padding: '12px 12px 12px 44px', border: '1.5px solid #E5E5E5',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#B8E0D2'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>
            <button
              onClick={() => searchCJ(keyword)}
              disabled={loading}
              style={{
                background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10,
                padding: '12px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
              }}
            >
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* Quick keyword chips */}
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CJ_KEYWORDS.map(kw => (
              <button
                key={kw}
                onClick={() => { setKeyword(kw); searchCJ(kw); }}
                style={{
                  padding: '5px 12px', borderRadius: 20, border: '1.5px solid #E5E5E5',
                  background: '#fff', fontSize: 12, cursor: 'pointer', color: '#555',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#B8E0D2'; e.target.style.background = '#F0FAF6'; }}
                onMouseLeave={e => { e.target.style.borderColor = '#E5E5E5'; e.target.style.background = '#fff'; }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#B91C1C', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{results.length} products found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {results.map(p => (
                <div key={p.cjId} style={{
                  background: '#fff', borderRadius: 14, overflow: 'hidden',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0',
                  transition: 'box-shadow 0.2s',
                }}>
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#F8F8F8' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    {p.freeShipping && (
                      <span style={{
                        position: 'absolute', top: 10, left: 10, background: '#B8E0D2',
                        color: '#1A5C40', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                      }}>FREE SHIP</span>
                    )}
                    <span style={{
                      position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)',
                      color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 20,
                    }}>{CATEGORY_MAP(p.category)}</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: '#1A1A1A' }}>
                      {p.name.length > 70 ? p.name.slice(0, 70) + '…' : p.name}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 12, color: '#888' }}>Cost: </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{parsePrice(p.sellPrice)}</span>
                      </div>
                      <span style={{ fontSize: 11, color: '#4CAF7D', fontWeight: 600 }}>{suggestRetail(p.sellPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#999' }}>Stock: {p.inventory?.toLocaleString()}</span>
                      {imported[p.cjId] ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4CAF7D', fontWeight: 600 }}>
                          <CheckCircle size={14} /> Imported
                        </span>
                      ) : (
                        <button
                          onClick={() => importProduct(p)}
                          disabled={importing[p.cjId]}
                          style={{
                            background: importing[p.cjId] ? '#E5E5E5' : '#1A1A1A',
                            color: importing[p.cjId] ? '#999' : '#fff',
                            border: 'none', borderRadius: 8, padding: '7px 14px',
                            fontSize: 12, fontWeight: 600, cursor: importing[p.cjId] ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          {importing[p.cjId] ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={12} />}
                          {importing[p.cjId] ? 'Importing…' : 'Import'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <Search size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontSize: 14 }}>Search above or click a quick keyword to browse CJ's catalog</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
