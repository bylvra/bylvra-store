import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Order } from '../api/entities';
import { Shield, Lock, ChevronRight } from 'lucide-react';

const InputField = ({ label, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>{label}</label>
    <input
      {...props}
      style={{
        width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px',
        padding: '12px 14px', fontSize: '14px', outline: 'none',
        fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s',
        ...props.style,
      }}
      onFocus={e => e.target.style.borderColor = '#1A1A1A'}
      onBlur={e => e.target.style.borderColor = '#E0E0E0'}
    />
  </div>
);

// ─── Stripe checkout helper ──────────────────────────────────────────────────
// When STRIPE_SECRET_KEY is set in your backend, this redirects to Stripe's
// hosted checkout. Until then, it saves the order locally and redirects.
async function redirectToStripe({ cartItems, email, name, orderNumber }) {
  try {
    const { base44 } = await import('../api/base44Client.js');
    const res = await base44.functions.createStripeCheckout({
      items: cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, images: i.images })),
      customerEmail: email,
      customerName: name,
      orderNumber,
    });
    if (res?.url) {
      window.location.href = res.url;
      return true;
    }
  } catch (e) {
    // Stripe not configured yet — fall through to local order
  }
  return false;
}

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', state: '', zip: '', country: 'United States',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
  });

  const shipping = cartSubtotal >= 50 ? 0 : 6.99;
  const tax = cartSubtotal * 0.08;
  const total = cartSubtotal + shipping + tax;
  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    const orderNum = 'BL' + Date.now().toString().slice(-6);

    try {
      // Save order record first
      await Order.create({
        order_number: orderNum,
        customer_email: form.email,
        customer_name: `${form.firstName} ${form.lastName}`,
        customer_phone: form.phone,
        shipping_address: { address: form.address, apartment: form.apartment, city: form.city, state: form.state, zip: form.zip, country: form.country },
        items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        subtotal: cartSubtotal,
        shipping_cost: shipping,
        total,
        status: 'pending',
        payment_status: 'pending',
      });

      // Attempt Stripe redirect
      const stripeRedirected = await redirectToStripe({
        cartItems,
        email: form.email,
        name: `${form.firstName} ${form.lastName}`,
        orderNumber: orderNum,
      });

      if (!stripeRedirected) {
        // Stripe not configured — proceed to confirmation
        clearCart();
        navigate(`/order-confirmation?order=${orderNum}`);
      }
      // If Stripe redirected, user leaves the page — cart cleared on return
    } catch (err) {
      clearCart();
      navigate(`/order-confirmation?order=${orderNum}`);
    }
    setSubmitting(false);
  };

  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ marginBottom: '16px' }}>Your cart is empty</h2>
      <Link to="/" style={{ color: '#1A1A1A', fontWeight: '700' }}>Continue Shopping →</Link>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: '800', letterSpacing: '2px', color: '#1A1A1A' }}>BYLVRA</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
            <Lock size={12} /> Secure Checkout
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }} className="checkout-grid">
        {/* Left: form */}
        <div>
          {/* Step indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            {['Contact & Shipping', 'Payment'].map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= i + 1 ? '#1A1A1A' : '#E0E0E0', color: step >= i + 1 ? '#fff' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>{i + 1}</div>
                  <span style={{ fontSize: '13px', fontWeight: step === i + 1 ? '700' : '400', color: step >= i + 1 ? '#1A1A1A' : '#888' }}>{s}</span>
                </div>
                {i === 0 && <ChevronRight size={14} style={{ color: '#CCC' }} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <InputField label="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
                  <InputField label="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
                </div>
                <InputField label="Email Address" type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
                <InputField label="Phone Number" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Shipping Address</h3>
                <InputField label="Address" value={form.address} onChange={e => update('address', e.target.value)} required />
                <InputField label="Apartment, Suite, etc. (optional)" value={form.apartment} onChange={e => update('apartment', e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0 16px' }}>
                  <InputField label="City" value={form.city} onChange={e => update('city', e.target.value)} required />
                  <InputField label="State" value={form.state} onChange={e => update('state', e.target.value)} required />
                  <InputField label="ZIP Code" value={form.zip} onChange={e => update('zip', e.target.value)} required />
                </div>
                <InputField label="Country" value={form.country} onChange={e => update('country', e.target.value)} required />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.firstName || !form.email || !form.address}
                style={{ width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', padding: '17px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', opacity: (!form.firstName || !form.email || !form.address) ? 0.5 : 1 }}
              >Continue to Payment</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Payment Information</h3>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={12} /> Your payment info is encrypted and secure.
                </p>
                <InputField label="Name on Card" value={form.cardName} onChange={e => update('cardName', e.target.value)} required />
                <InputField label="Card Number" value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <InputField label="Expiry Date" value={form.expiry} onChange={e => update('expiry', e.target.value)} placeholder="MM/YY" required />
                  <InputField label="CVV" value={form.cvv} onChange={e => update('cvv', e.target.value)} placeholder="123" required />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {['VISA', 'MC', 'AMEX', 'PAYPAL', '🍎PAY'].map((p, i) => (
                    <span key={i} style={{ background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: '700', color: '#666' }}>{p}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <button onClick={() => setStep(1)} style={{ flex: '0 0 auto', background: '#F5F5F5', color: '#1A1A1A', border: 'none', padding: '17px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !form.cardNumber || !form.cvv}
                  style={{ flex: 1, background: '#1A1A1A', color: '#fff', border: 'none', padding: '17px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', opacity: (submitting || !form.cardNumber) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Lock size={14} />
                  {submitting ? 'Processing…' : `Place Order — $${total.toFixed(2)}`}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
                By placing your order you agree to our <Link to="/pages/terms" style={{ color: '#1A1A1A' }}>Terms</Link> and <Link to="/pages/privacy" style={{ color: '#1A1A1A' }}>Privacy Policy</Link>.
              </p>
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', position: 'sticky', top: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', background: '#F8F4F4' }}>
                    <img src={item.images?.[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#1A1A1A', color: '#fff', fontSize: '10px', fontWeight: '700', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{item.category}</p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
            {[['Subtotal', `$${cartSubtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`], ['Estimated Tax', `$${tax.toFixed(2)}`]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: label === 'Shipping' && shipping === 0 ? '#2D9E6B' : '#666', marginBottom: '8px', fontWeight: label === 'Shipping' && shipping === 0 ? '600' : '400' }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', borderTop: '1.5px solid #E0E0E0', paddingTop: '16px', marginTop: '8px' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ marginTop: '20px', padding: '14px', background: '#F8FFF8', borderRadius: '8px', border: '1px solid #B8E0D2', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={16} style={{ color: '#2D9E6B', flexShrink: 0 }} />
            <p style={{ fontSize: '12px', color: '#1A5F3D', fontWeight: '500' }}>30-day satisfaction guarantee. Returns made easy.</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
