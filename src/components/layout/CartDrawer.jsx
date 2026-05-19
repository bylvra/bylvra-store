import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { X, Plus, Minus, ShoppingBag, ChevronRight, Shield, Truck, RotateCcw } from 'lucide-react';

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const FREE_SHIPPING_THRESHOLD = 50;
  const shipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6.99;
  const progress = Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 199, backdropFilter: 'blur(2px)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '420px', maxWidth: '100vw',
        background: '#fff', zIndex: 200,
        display: 'flex', flexDirection: 'column',
        transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} />
            <span style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>
              Your Cart {cartCount > 0 && <span style={{ color: '#888', fontWeight: '400' }}>({cartCount})</span>}
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
            <ShoppingBag size={48} style={{ color: '#ddd', marginBottom: '16px' }} />
            <p style={{ color: '#888', marginBottom: '24px', fontSize: '15px' }}>Your cart is empty</p>
            <button
              onClick={() => setCartOpen(false)}
              style={{
                background: '#1A1A1A', color: '#fff', border: 'none',
                padding: '14px 32px', borderRadius: '4px', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase',
              }}
            >Start Shopping</button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div style={{ padding: '14px 24px', background: '#F8F8F8', borderBottom: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '12px', color: '#555', marginBottom: '8px', fontWeight: '500' }}>
                {shipping === 0
                  ? '🎉 You\'ve unlocked FREE shipping!'
                  : `Add $${(FREE_SHIPPING_THRESHOLD - cartSubtotal).toFixed(2)} more for FREE shipping`
                }
              </p>
              <div style={{ background: '#E8E8E8', borderRadius: '99px', height: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`, height: '100%',
                  background: '#B8E0D2',
                  borderRadius: '99px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex', gap: '16px', padding: '16px 0',
                  borderBottom: '1px solid #f5f5f5',
                }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden',
                    flexShrink: 0, background: '#F5F0F0',
                  }}>
                    <img src={item.images?.[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', lineHeight: 1.3 }}>{item.name}</p>
                    <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>{item.category}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E8E8E8', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', alignSelf: 'flex-start', padding: '2px' }}>
                    <X size={16} />
                  </button>
                </div>
              ))}

              {/* You may also like */}
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #f0f0f0' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', color: '#888' }}>You May Also Like</p>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {['ZeroSpot Patches', 'ClearPore Niacinamide Toner', 'The Sculpt Tool', 'DreamSilk Sleep Mask'].map((name, i) => (
                    <div key={i} style={{ flexShrink: 0, width: '100px' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '8px', background: '#F5F0F0', overflow: 'hidden', marginBottom: '8px' }}>
                        <img
                          src={['https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200', 'https://images.unsplash.com/photo-1617897903246-719242758050?w=200', 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=200', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200'][i]}
                          alt={name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: '500', lineHeight: 1.3, color: '#1A1A1A' }}>{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
              {/* Discount */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  placeholder="Discount code"
                  style={{
                    flex: 1, border: '1px solid #E0E0E0', borderRadius: '4px',
                    padding: '10px 14px', fontSize: '13px', outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <button style={{
                  background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: '4px',
                  padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                }}>Apply</button>
              </div>

              {/* Totals */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#2D9E6B' : 'inherit' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                  <span>Total</span>
                  <span>${(cartSubtotal + shipping).toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
                {[{ icon: <Shield size={14} />, text: 'Secure' }, { icon: <Truck size={14} />, text: 'Free Shipping' }, { icon: <RotateCcw size={14} />, text: '30-Day Returns' }].map((badge, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888' }}>
                    {badge.icon} {badge.text}
                  </div>
                ))}
              </div>

              {/* Payment icons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                {['VISA', 'MC', 'PayPal', '🍎Pay'].map((p, i) => (
                  <span key={i} style={{
                    background: '#F5F5F5', border: '1px solid #E8E8E8',
                    borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: '700', color: '#666',
                  }}>{p}</span>
                ))}
              </div>

              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: '#1A1A1A', color: '#fff', textDecoration: 'none',
                  padding: '16px', borderRadius: '4px', fontWeight: '700',
                  fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.target.style.background = '#333'}
                onMouseLeave={e => e.target.style.background = '#1A1A1A'}
              >
                Checkout <ChevronRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  );
}
