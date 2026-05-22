import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function EmailCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    const dismissed = localStorage.getItem('bylvra_popup_dismissed');
    const subscribed = localStorage.getItem('bylvra_subscribed');
    if (dismissed || subscribed) return;

    // Show after 8 seconds on first visit
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('bylvra_popup_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { NewsletterSubscriber } = await import('../../api/entities.js');
      await NewsletterSubscriber.create({
        email,
        source: 'popup',
        discount_sent: false,
      });
      localStorage.setItem('bylvra_subscribed', 'true');
      setSubmitted(true);
    } catch (err) {
      // Even if entity save fails (e.g. duplicate), show success to user
      localStorage.setItem('bylvra_subscribed', 'true');
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(26,26,26,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .bylvra-popup-input:focus { outline: none; border-color: #1A1A1A !important; }
        .bylvra-popup-btn:hover { background: #333 !important; }
        .bylvra-popup-close:hover { color: #1A1A1A !important; }
      `}</style>
      <div style={{
        background: '#fff', maxWidth: '440px', width: '100%',
        borderRadius: '4px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Blush accent bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #FCE4EC, #B8E0D2)' }} />

        {/* Close */}
        <button
          onClick={dismiss}
          className="bylvra-popup-close"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#aaa', transition: 'color 0.2s', padding: '4px',
          }}
        ><X size={18} /></button>

        <div style={{ padding: '40px 40px 36px' }}>
          {!submitted ? (
            <>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#FCE4EC', borderRadius: '2px',
                padding: '4px 10px', marginBottom: '20px',
              }}>
                <Sparkles size={11} color="#c97a8a" />
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#c97a8a' }}>
                  Welcome Offer
                </span>
              </div>

              <h2 style={{
                fontSize: '26px', fontWeight: '800', color: '#1A1A1A',
                letterSpacing: '-0.8px', lineHeight: '1.2', marginBottom: '12px',
              }}>
                15% off your<br />first order.
              </h2>

              <p style={{
                fontSize: '13px', color: '#666', lineHeight: '1.6',
                marginBottom: '28px',
              }}>
                Join the BYLVRA community. Be first to know about new formulas, restocks, and exclusive offers.
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bylvra-popup-input"
                  style={{
                    width: '100%', padding: '14px 16px',
                    border: '1px solid #e0e0e0', borderRadius: '4px',
                    fontSize: '14px', color: '#1A1A1A',
                    background: '#fafafa', boxSizing: 'border-box',
                    marginBottom: '12px', transition: 'border-color 0.2s',
                  }}
                />
                {error && <p style={{ fontSize: '12px', color: '#c0392b', marginBottom: '10px' }}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="bylvra-popup-btn"
                  style={{
                    width: '100%', padding: '14px',
                    background: '#1A1A1A', color: '#fff',
                    border: 'none', borderRadius: '4px',
                    fontSize: '12px', fontWeight: '700',
                    letterSpacing: '2px', textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'background 0.2s',
                  }}
                >
                  {loading ? 'Subscribing…' : 'Claim 15% Off'}
                </button>
              </form>

              <p style={{
                fontSize: '11px', color: '#bbb', textAlign: 'center',
                marginTop: '16px', lineHeight: '1.5',
              }}>
                No spam. Unsubscribe anytime.<br />
                Discount code sent via email within minutes.
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: '#B8E0D2', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 20px',
                fontSize: '22px',
              }}>✓</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A1A', marginBottom: '10px', letterSpacing: '-0.5px' }}>
                You're in.
              </h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '8px' }}>
                Your 15% off code is on its way to <strong>{email}</strong>.
              </p>
              <p style={{ fontSize: '12px', color: '#aaa' }}>
                Use code <strong style={{ color: '#1A1A1A', letterSpacing: '1px' }}>WELCOME15</strong> at checkout.
              </p>
              <button
                onClick={() => setVisible(false)}
                style={{
                  marginTop: '24px', padding: '12px 32px',
                  background: '#1A1A1A', color: '#fff',
                  border: 'none', borderRadius: '4px',
                  fontSize: '12px', fontWeight: '700',
                  letterSpacing: '2px', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
