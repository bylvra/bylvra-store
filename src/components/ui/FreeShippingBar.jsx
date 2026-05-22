import React from 'react';
import { Truck } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function FreeShippingBar() {
  const { cartSubtotal } = useCart();
  const threshold = 50;
  const remaining = Math.max(0, threshold - cartSubtotal);
  const pct = Math.min(100, (cartSubtotal / threshold) * 100);
  const qualified = cartSubtotal >= threshold;

  return (
    <div style={{ background: '#f8f8f8', padding: '10px 16px', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#444', marginBottom: '6px', fontWeight: '500' }}>
          <Truck size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
          {qualified
            ? <span style={{ color: '#2D9E6B', fontWeight: '700' }}>🎉 You've unlocked free shipping!</span>
            : <span>Spend <strong>${remaining.toFixed(2)}</strong> more for <strong>free shipping</strong></span>
          }
        </p>
        <div style={{ height: '4px', background: '#e0e0e0', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: qualified ? '#2D9E6B' : 'linear-gradient(90deg, #FCE4EC, #B8E0D2)',
            borderRadius: '99px', transition: 'width 0.5s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
