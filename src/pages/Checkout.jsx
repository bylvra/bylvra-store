import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Order, AbandonedCart } from '../api/entities';
import { Shield, Lock, ChevronRight, Tag, Truck, RotateCcw } from 'lucide-react';

const DISCOUNT_CODES = {
  'BYLVRA10': 0.10,
  'WELCOME15': 0.15,
  'BEAUTY20': 0.20,
};

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

async function redirectToStripe({ cartItems, email, name, orderNumber, shippingAddress }) {
  try {
    const { base44 } = await import('../api/base44Client.js');
    const res = await base44.functions.createStripeCheckout({
      items: cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, images: i.images })),
      customerEmail: email,
      customerName: name,
      orderNumber,
      shippingAddress,
    });
    if (res?.url) {
      window.location.href = res.url;
      return true;
    }
  } catch (e) {
    // fall through
  }
  return false;
}


// Save/update abandoned cart when email is entered
async function saveAbandonedCart({ email, firstName, cartItems, cartTotal }) {
  if (!email || !email.includes('@') || cartItems.length === 0) return;
  const sessionId = 'ac_' + email.replace(/[^a-z0-9]/gi, '') + '_' + Date.now().toString().slice(-6);
  try {
    // Check if one already exists for this email (not yet recovered)
    const existing = await AbandonedCart.filter({ email, recovered: false });
    if (existing && existing.length > 0) {
      await AbandonedCart.update(existing[0].id, {
        first_name: firstName || '',
        cart_items: cartItems,
        cart_total: cartTotal,
        email_sent: false,
      });
    } else {
      await AbandonedCart.create({
        email,
        first_name: firstName || '',
        cart_items: cartItems,
        cart_total: cartTotal,
        recovered: false,
        email_sent: false,
        session_id: sessionId,
      });
    }
  } catch (e) {
    // Silent fail — don't interrupt checkout
  }
}

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', state: '', zip: '', country: 'United States',
  });

  const shipping = cartSubtotal >= 50 ? 0 : 6.99;
  const discountAmount = appliedDiscount ? cartSubtotal * appliedDiscount.rate : 0;
  const tax = (cartSubtotal - discountAmount) * 0.08;
  const total = cartSubtotal - discountAmount + shipping + tax;
  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const applyDiscount = () => {
    const rate = DISCOUNT_CODES[discountCode.toUpperCase()];
    if (rate) {
      setAppliedDiscount({ code: discountCode.toUpperCase(), rate });
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code.');
    }
  };

  const [paymentError, setPaymentError] = useState('');

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setPaymentError('');
    const orderNum = 'BL' + Date.now().toString().slice(-6);
    const shippingAddress = {
      name: `${form.firstName} ${form.lastName}`,
      line1: form.address,
      line2: form.apartment,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      countryCode: 'US',
      phone: form.phone,
    };

    try {
      await Order.create({
        order_number: orderNum,
        customer_email: form.email,
        customer_name: `${form.firstName} ${form.lastName}`,
        customer_phone: form.phone,
        shipping_address: shippingAddress,
        items: cartItems.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          cjSku: i.cjSku || null,
          cjProductId: i.cjProductId || null,
          images: i.images,
        })),
        subtotal: cartSubtotal,
        shipping_cost: shipping,
        discount_amount: discountAmount,
        discount_code: appliedDiscount?.code || null,
        total,
        status: 'pending',
        payment_status: 'pending',
      });

      const stripeRedirected = await redirectToStripe({
        cartItems,
        email: form.email,
        name: `${form.firstName} ${form.lastName}`,
        orderNumber: orderNum,
        shippingAddress,
      });

      if (!stripeRedirected) {
        setPaymentError('Unable to connect to payment. Please try again or contact contactbylvra@gmail.com.');
        setSubmitting(false);
        return;
      }
      // Stripe redirect in progress — mark abandoned cart recovered
      try {
        const abandoned = await AbandonedCart.filter({ email: form.email, recovered: false });
        if (abandoned && abandoned.length > 0) {
          await AbandonedCart.update(abandoned[0].id, { recovered: true });
        }
      } catch (e) {}
    } catch (err) {
      setPaymentError('Something went wrong processing your order. Please try again or contact contactbylvra@gmail.com.');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
  };

  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ marginBottom: '16px', fontWeight: '800' }}>Your cart is empty</h2>
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
          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            {['Contact & Shipping', 'Review & Pay'].map((s, i) => (
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
                <InputField label="Email Address" type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  onBlur={e => {
                    if (e.target.value && e.target.value.includes('@')) {
                      saveAbandonedCart({
                        email: e.target.value,
                        firstName: form.firstName,
                        cartItems,
                        cartTotal: cartSubtotal,
                      });
                    }
                  }}
                  required />
                <InputField label="Phone Number" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Shipping Address</h3>
                <InputField label="Address" value={form.address} onChange={e => update('address', e.target.value)} required />
                <InputField label="Apartment, Suite, etc. (optional)" value={form.apartment} onChange={e => update('apartment', e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0 16px' }}>
                  <InputField label="City" value={form.city} onChange={e => update('city', e.target.value)} required />
                  <InputField label="State" value={form.state} onChange={e => update('state', e.target.value)} required />
                  <InputField label="ZIP" value={form.zip} onChange={e => update('zip', e.target.value)} required />
                </div>
                <InputField label="Country" value={form.country} onChange={e => update('country', e.target.value)} required />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.firstName || !form.email || !form.address || !form.city || !form.zip}
                style={{ width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', padding: '17px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', opacity: (!form.firstName || !form.email || !form.address) ? 0.5 : 1 }}
              >Continue to Review →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Shipping summary */}
              <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 28px', border: '1px solid #F0F0F0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Shipping to</p>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{form.address}, {form.city}, {form.state} {form.zip}</p>
                </div>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: '600', color: '#1A1A1A', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
              </div>

              {/* Payment via Stripe */}
              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Payment</h3>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={12} /> You'll be securely redirected to Stripe's checkout to complete payment.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'].map(m => (
                    <span key={m} style={{ padding: '4px 10px', background: '#F5F5F5', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#555', border: '1px solid #E8E8E8' }}>{m}</span>
                  ))}
                </div>
              </div>

              {paymentError && (
                <div style={{ background: '#FFF0F0', border: '1px solid #FFCCCC', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', fontSize: '13px', color: '#CC0000', fontWeight: '500' }}>
                  ⚠️ {paymentError}
                </div>
              )}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                style={{ width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', padding: '18px', borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Lock size={14} /> {submitting ? 'Redirecting to Payment…' : `Pay $${total.toFixed(2)} Securely`}
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
                {[
                  [Shield, '256-bit SSL'],
                  [Truck, 'Free shipping $50+'],
                  [RotateCcw, '30-day returns'],
                ].map(([Icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#888' }}>
                    <Icon size={12} />{text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h3>

            {/* Items */}
            <div style={{ marginBottom: '20px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', background: '#F5F0F0' }}>
                      <img src={item.images?.[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#1A1A1A', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', lineHeight: 1.3, marginBottom: '2px' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{item.category}</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '700', marginLeft: '8px', whiteSpace: 'nowrap' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount code */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #F0F0F0' }}>
              {!appliedDiscount ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    style={{ flex: 1, border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                    onFocus={e => e.target.style.borderColor = '#1A1A1A'}
                    onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                    onKeyDown={e => e.key === 'Enter' && applyDiscount()}
                  />
                  <button onClick={applyDiscount} style={{ background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Apply</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#F0FDF4', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
                  <Tag size={14} style={{ color: '#166534' }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#166534', flex: 1 }}>{appliedDiscount.code} — {Math.round(appliedDiscount.rate * 100)}% off</span>
                  <button onClick={() => { setAppliedDiscount(null); setDiscountCode(''); }} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#888', cursor: 'pointer' }}>✕</button>
                </div>
              )}
              {discountError && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px' }}>{discountError}</p>}
            </div>

            {/* Totals */}
            <div style={{ fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                <span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#166534', fontWeight: '600' }}>
                  <span>Discount</span><span>−${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#166534' : '#555', fontWeight: shipping === 0 ? '600' : '400' }}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#555' }}>
                <span>Tax (est.)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '2px solid #1A1A1A', fontSize: '16px', fontWeight: '800' }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
