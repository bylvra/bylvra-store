import React from 'react';
import { Truck, Clock, Globe, Package } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Logistics</p>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '16px' }}>Shipping Policy</h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '480px', margin: '0 auto' }}>Everything you need to know about how we get your order to you.</p>
      </div>

      {/* Summary cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '64px' }}>
          {[
            { icon: <Clock size={24}/>, title: 'Processing', time: '1–3 Business Days', detail: 'After order confirmation' },
            { icon: <Truck size={24}/>, title: 'Standard Shipping', time: '7–15 Business Days', detail: 'Free on orders over $50' },
            { icon: <Package size={24}/>, title: 'Express Shipping', time: '5–10 Business Days', detail: 'Available at checkout' },
            { icon: <Globe size={24}/>, title: 'International', time: '10–20 Business Days', detail: 'Most countries worldwide' },
          ].map((c, i) => (
            <div key={i} style={{ background: '#FAFAFA', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', textAlign: 'center' }}>
              <div style={{ color: '#B8E0D2', marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>{c.icon}</div>
              <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>{c.title}</p>
              <p style={{ fontSize: '17px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>{c.time}</p>
              <p style={{ fontSize: '13px', color: '#888' }}>{c.detail}</p>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '720px' }}>
          {[
            { title: 'Order Processing', body: 'All orders are processed within 1–3 business days (Monday–Friday, excluding public holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. During peak periods (sale events, new launches), processing may take up to 5 business days.' },
            { title: 'Domestic Shipping (United States)', body: 'Standard shipping (7–15 business days): FREE on orders over $50. $6.99 on orders under $50.\n\nExpress shipping (5–10 business days): $12.99 flat rate. Available at checkout.\n\nAll domestic orders are dispatched via USPS, UPS, or FedEx depending on your location and order size.' },
            { title: 'International Shipping', body: 'We ship to most countries worldwide. International orders typically arrive within 10–20 business days depending on destination and customs processing. Shipping rates for international orders are calculated at checkout based on destination and weight.\n\nPlease note: International customers are responsible for any customs fees, duties, or import taxes levied by their country. These charges are not collected by BYLVRA and cannot be pre-paid at checkout.' },
            { title: 'Order Tracking', body: 'Once your order ships, you will receive an email with your tracking number and a link to track your package in real-time. You can also visit our Track Order page and enter your order number and email address. Please allow 24–48 hours after receiving your tracking email for the carrier\'s system to update.' },
            { title: 'Lost or Damaged Packages', body: 'If your package arrives damaged or does not arrive within the estimated delivery window, please contact us at hello@bylvra.shop with your order number. We will investigate with the carrier and either reship your order or issue a full refund at our discretion. Claims for lost packages must be submitted within 30 days of the estimated delivery date.' },
            { title: 'Address Changes', body: 'Address changes can only be accommodated within 2 hours of placing your order, before it enters our processing queue. Contact hello@bylvra.shop immediately with your order number and updated address. Once an order is dispatched, we cannot redirect shipments.' },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>{s.title}</h2>
              {s.body.split('\n\n').map((para, j) => (
                <p key={j} style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, marginBottom: '12px' }}>{para}</p>
              ))}
              <div style={{ height: '1px', background: '#F0F0F0', marginTop: '32px' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: '80px' }} />
    </div>
  );
}
