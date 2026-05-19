import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { PRODUCTS } from '../../api/productsData';
import { X, Plus, Minus, ShoppingBag, Shield, Truck, RotateCcw } from 'lucide-react';

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount, addToCart } = useCart();
  const FREE_SHIPPING_THRESHOLD = 50;
  const shipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6.99;
  const progress = Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Upsell: products not already in cart, pick up to 4
  const cartIds = new Set(cartItems.map(i => i.id));
  const upsells = PRODUCTS.filter(p => !cartIds.has(p.id) && p.badge === 'BESTSELLER').slice(0, 4);

  return (
    <>
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 199, backdropFilter: 'blur(3px)', animation: 'fadeIn 0.2s ease' }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '420px', maxWidth: '100vw',
        background: '#fff', zIndex: 200,
        display: 'flex', flexDirection: 'column',
        transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.14)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} />
            <span style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>
              Your Cart {cartCount > 0 && <span style={{ color: '#888', fontWeight: '400' }}>({cartCount})</span>}
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: '#F5F5F5', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
            <ShoppingBag size={48} style={{ color: '#ddd', marginBottom: '16px' }} />
            <p style={{ color: '#888', marginBottom: '24px', fontSize: '15px' }}>Your cart is empty</p>
            <button
              onClick={() => setCartOpen(false)}
              style={{ background: '#1A1A1A', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}
            >Start Shopping</button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div style={{ padding: '12px 24px', background: '#F8FFF8', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
              <p style={{ fontSize: '12px', color: '#2D6A4F', marginBottom: '8px', fontWeight: '600' }}>
                {shipping === 0 ? '🎉 You\'ve unlocked FREE shipping!' : `Add $${(FREE_SHIPPING_THRESHOLD - cartSubtotal).toFixed(2)} more for FREE shipping`}
              </p>
              <div style={{ background: '#E0E0E0', borderRadius: '99px', height: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#B8E0D2', borderRadius: '99px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {/* Cart items */}
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <Link to={`/products/${item.slug}`} onClick={() => setCartOpen(false)} style={{ flexShrink: 0 }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#F5F0F0' }}>
                      <img src={item.images?.[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>{item.category}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', border: '1px solid #E8E8E8', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', color: '#555' }}><Minus size={12} /></button>
                        <span style={{ fontSize: '13px', minWidth: '20px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', color: '#555' }}><Plus size={12} /></button>
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', alignSelf: 'flex-start', padding: '2px', flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Upsells */}
              {upsells.length > 0 && (
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #f0f0f0' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', color: '#888' }}>You May Also Like</p>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {upsells.map(p => (
                      <div key={p.id} style={{ flexShrink: 0, width: '110px' }}>
                        <div style={{ width: '110px', height: '110px', borderRadius: '8px', background: '#F5F0F0', overflow: 'hidden', marginBottom: '8px', cursor: 'pointer' }}
                          onClick={() => { addToCart(p); }}>
                          <img src={p.images?.[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <p style={{ fontSize: '11px', fontWeight: '600', lineHeight: 1.3, color: '#1A1A1A', marginBottom: '4px' }}>{p.name}</p>
                        <p style={{ fontSize: '11px', color: '#888' }}>${p.price.toFixed(2)}</p>
                        <button
                          onClick={() => addToCart(p)}
                          style={{ marginTop: '6px', width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px', fontSize: '10px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' }}
                        >+ ADD</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #f0f0f0', background: '#fff', flexShrink: 0 }}>
              {/* Trust badges */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
                {[[Shield, '256-bit SSL'], [Truck, 'Free $50+'], [RotateCcw, '30-day returns']].map(([Icon, text]) => (
                  <div key={text} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <Icon size={14} style={{ color: '#888' }} />
                    <span style={{ fontSize: '10px', color: '#888', fontWeight: '500' }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#555' }}>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px', fontWeight: '800' }}>
                <span>Est. Total</span>
                <span>${(cartSubtotal + shipping).toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                style={{
                  display: 'block', textAlign: 'center', background: '#1A1A1A', color: '#fff',
                  textDecoration: 'none', padding: '17px', borderRadius: '6px',
                  fontSize: '14px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase',
                }}
              >
                Checkout — ${(cartSubtotal + shipping).toFixed(2)}
              </Link>
              <button
                onClick={() => setCartOpen(false)}
                style={{ display: 'block', width: '100%', background: 'none', border: 'none', marginTop: '12px', fontSize: '13px', color: '#888', cursor: 'pointer', padding: '4px' }}
              >Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
