import { Link } from 'react-router-dom';
import { Package, Mail, RotateCcw, FileText, ChevronRight, Truck, MessageCircle } from 'lucide-react';
import SEO from '../components/ui/SEO';

export default function Account() {
  return (
    <>
      <SEO title="My Account" url="https://bylvra.shop/account" />
      <div style={{ minHeight: '70vh', background: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>

          {/* Header */}
          <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Your Account</p>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px', marginBottom: '8px' }}>
            What do you need?
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '40px' }}>
            Track your order, start a return, or get in touch with us.
          </p>

          {/* Action tiles */}
          {[
            {
              icon: <Truck size={20} />,
              label: 'Track My Order',
              desc: 'Enter your order number to see real-time shipping status.',
              to: '/pages/track-order',
            },
            {
              icon: <RotateCcw size={20} />,
              label: 'Returns & Exchanges',
              desc: 'Review our 30-day return policy and start a return.',
              to: '/pages/returns-policy',
            },
            {
              icon: <Package size={20} />,
              label: 'Shipping Info',
              desc: 'Estimated delivery times, carriers, and tracking details.',
              to: '/pages/shipping-policy',
            },
            {
              icon: <MessageCircle size={20} />,
              label: 'Contact Us',
              desc: 'Send us a message — we respond within 24 hours.',
              to: '/pages/contact',
            },
            {
              icon: <FileText size={20} />,
              label: 'FAQ',
              desc: 'Answers to common questions about orders and products.',
              to: '/pages/faq',
            },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px 0', borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#FCE4EC', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#1A1A1A', flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{item.desc}</p>
                </div>
                <ChevronRight size={16} color="#ccc" />
              </div>
            </Link>
          ))}

          {/* Email CTA */}
          <div style={{ marginTop: '40px', background: '#f9f9f9', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
            <Mail size={20} color="#1A1A1A" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>Need direct help?</p>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>Email us at <strong>contactbylvra@gmail.com</strong></p>
            <a
              href="mailto:contactbylvra@gmail.com"
              style={{
                display: 'inline-block', background: '#1A1A1A', color: '#fff',
                textDecoration: 'none', padding: '12px 28px', borderRadius: '4px',
                fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase',
              }}
            >
              Send Email
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
