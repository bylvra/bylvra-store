import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export function trackView(product) {
  try {
    const key = 'bylvra_recently_viewed';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter(p => p.id !== product.id);
    const updated = [{ id: product.id, name: product.name, slug: product.slug, price: product.price, images: product.images }, ...filtered].slice(0, 8);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {}
}

export default function RecentlyViewed({ currentId }) {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bylvra_recently_viewed') || '[]');
      setItems(stored.filter(p => p.id !== currentId).slice(0, 4));
    } catch (e) {}
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <div style={{ padding: '64px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-0.5px' }}>Recently Viewed</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {items.map(p => (
          <Link key={p.id} to={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', background: '#f8f8f8', aspectRatio: '1', marginBottom: '10px' }}>
              <img src={p.images?.[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            </div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', marginBottom: '4px' }}>{p.name}</p>
            <p style={{ fontSize: '13px', color: '#888' }}>${Number(p.price).toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
