import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A', color: '#fff', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>LUMARA</h3>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
              Clinically formulated skincare and beauty tools. Visible results backed by science.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[<Instagram size={18} />, <Twitter size={18} />, <Youtube size={18} />].map((icon, i) => (
                <a key={i} href="#" style={{
                  color: '#aaa', display: 'flex', alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
                >{icon}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: '#fff' }}>Shop</h4>
            {[['Skincare', '/collections/skincare'], ['Tools & Devices', '/collections/tools-devices'], ['Hair', '/collections/hair'], ['Body', '/collections/body'], ['Wellness', '/collections/wellness']].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: 'block', color: '#aaa', textDecoration: 'none', fontSize: '14px', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#aaa'}
              >{label}</Link>
            ))}
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: '#fff' }}>Help</h4>
            {[['FAQ', '/pages/faq'], ['Track Order', '/pages/track-order'], ['Shipping Policy', '/pages/shipping'], ['Returns Policy', '/pages/returns'], ['Contact Us', '/pages/contact']].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: 'block', color: '#aaa', textDecoration: 'none', fontSize: '14px', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#aaa'}
              >{label}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: '#fff' }}>Legal</h4>
            {[['About Us', '/pages/about'], ['Privacy Policy', '/pages/privacy'], ['Terms of Service', '/pages/terms']].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: 'block', color: '#aaa', textDecoration: 'none', fontSize: '14px', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#aaa'}
              >{label}</Link>
            ))}
            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>We Accept</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['VISA', 'MC', 'AMEX', 'PayPal', '🍎Pay'].map((p, i) => (
                  <span key={i} style={{
                    background: '#333', border: '1px solid #444',
                    borderRadius: '3px', padding: '3px 7px', fontSize: '10px', color: '#ccc', fontWeight: '600',
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ color: '#666', fontSize: '12px' }}>© 2025 Lumara Beauty. All rights reserved.</p>
          <p style={{ color: '#666', fontSize: '12px' }}>Crafted with clinical precision. Every formula, every device.</p>
        </div>
      </div>
    </footer>
  );
}
