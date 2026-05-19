import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=1800&fit=crop"
          alt="About BYLVRA"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.5)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
          <p style={{ color: '#B8E0D2', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Our Story</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '800', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '16px' }}>
            Built on Science.<br />Driven by Results.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '480px' }}>
            We built BYLVRA because we were frustrated with skincare that promised everything and delivered nothing.
          </p>
        </div>
      </div>

      {/* Mission Section - 2 column split */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '96px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="about-grid">
        <div>
          <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '16px' }}>The BYLVRA Mission</p>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px', marginBottom: '24px', lineHeight: 1.15 }}>
            Skincare shouldn't be a guessing game.
          </h2>
          <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.8, marginBottom: '20px' }}>
            We founded BYLVRA in 2023 after years of watching people spend thousands on products with no clinical evidence behind them — flashy packaging, vague "natural" claims, and ingredients so under-dosed they couldn't possibly work.
          </p>
          <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.8, marginBottom: '20px' }}>
            Every BYLVRA product is formulated around one principle: does the active ingredient work at this concentration, at this pH, in this delivery format? If the published literature doesn't support it, we don't make the claim. Full stop.
          </p>
          <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.8 }}>
            We source clinical-grade actives — niacinamide at 10%, L-ascorbic acid at 15%, retinol in time-release encapsulation — and pair them with the latest at-home devices that replicate what you'd find in a dermatologist's treatment room.
          </p>
        </div>
        <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/5' }}>
          <img
            src="https://images.unsplash.com/photo-1556228578-8e89ef1b2120?w=800&fit=crop"
            alt="BYLVRA Lab"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Values */}
      <section style={{ background: '#FAFAFA', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>What We Stand For</p>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px' }}>Our Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            {[
              { title: 'Evidence First', desc: 'Every claim we make is backed by peer-reviewed research. If a concentration doesn\'t achieve clinical significance, we reformulate. No exceptions.' },
              { title: 'Radical Transparency', desc: 'We publish every active ingredient with its exact percentage. No "proprietary blends" hiding under-dosed actives. You deserve to know what you\'re applying.' },
              { title: 'Accessible Expertise', desc: 'Professional-grade skincare shouldn\'t require a $500 spa visit. We believe dermatologist-quality results should be available to everyone, at home.' },
              { title: 'Zero Compromise', desc: 'We\'d rather launch nothing than launch something that doesn\'t work. Our product development cycle is slow, deliberate, and ruthlessly tested.' },
            ].map((v, i) => (
              <div key={i} style={{ padding: '32px', background: '#fff', borderRadius: '12px', border: '1px solid #F0F0F0' }}>
                <div style={{ width: '40px', height: '3px', background: '#B8E0D2', borderRadius: '2px', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>{v.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1A1A1A', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: '#B8E0D2', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>Ready to Begin?</p>
        <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '24px' }}>
          Shop Clinically Formulated Skincare
        </h2>
        <Link to="/collections/all" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#B8E0D2', color: '#1A1A1A', textDecoration: 'none',
          padding: '16px 36px', borderRadius: '4px',
          fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
        }}>Explore All Products <ArrowRight size={14} /></Link>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}
