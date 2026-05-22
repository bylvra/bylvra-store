import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function StickyAddToCart({ product, selectedVariant, quantity }) {
  const [visible, setVisible] = useState(false);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    addToCart({ ...product, variant: selectedVariant }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
      background: '#fff', borderTop: '1px solid #eee',
      padding: '12px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '16px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      animation: 'slideUp 0.25s ease',
    }}>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <img src={product.images?.[0]} alt={product.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
          <p style={{ fontSize: '13px', color: '#888' }}>${Number(product.price).toFixed(2)}</p>
        </div>
      </div>
      <button
        onClick={handleAdd}
        style={{
          background: added ? '#2D9E6B' : '#1A1A1A',
          color: '#fff', border: 'none', borderRadius: '6px',
          padding: '12px 24px', fontSize: '12px', fontWeight: '700',
          letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          flexShrink: 0, transition: 'background 0.3s',
          whiteSpace: 'nowrap',
        }}
      >
        <ShoppingBag size={14} />
        {added ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}
