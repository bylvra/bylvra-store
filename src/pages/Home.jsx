import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../api/entities';
import ProductCard from '../components/ui/ProductCard';
import { useCart } from '../contexts/CartContext';
import { PRODUCTS } from '../api/productsData';
import { ChevronRight, Star, Shield, Truck, RotateCcw, Headphones, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'Skincare', slug: 'skincare', img: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop', desc: 'Serums, toners & treatments' },
  { name: 'Tools & Devices', slug: 'tools-devices', img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=700&fit=crop', desc: 'Clinical tech for home' },
  { name: 'Hair', slug: 'hair', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=700&fit=crop', desc: 'Growth & scalp care' },
  { name: 'Body', slug: 'body', img: 'https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop', desc: 'IPL & body treatments' },
  { name: 'Wellness', slug: 'wellness', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=700&fit=crop', desc: 'Posture, sleep & recovery' },
];

const TESTIMONIALS = [
  { name: 'Sophia R.', location: 'New York, NY', rating: 5, text: 'The GlowPro LED Mask changed my skin in 3 weeks. My dermatologist asked what I was doing differently. This is the real deal — not just hype.', avatar: 'S', product: 'GlowPro LED Mask' },
  { name: 'Madison T.', location: 'Los Angeles, CA', rating: 5, text: 'The Overnight Reset Serum gave me the smoothest skin I\'ve had in years. Zero irritation, which shocked me for a retinol. I\'m obsessed.', avatar: 'M', product: 'Overnight Reset Serum' },
  { name: 'Priya K.', location: 'London, UK', rating: 5, text: 'LashDense is the only lash serum I\'ve tried that actually delivers. Fuller, longer lashes in 4 weeks. I cancelled my lash extension appointment.', avatar: 'P', product: 'LashDense Growth Serum' },
];

const TRUST_BADGES = [
  { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On all orders over $50' },
  { icon: <RotateCcw size={28} />, title: '30-Day Guarantee', desc: 'No questions asked returns' },
  { icon: <Shield size={28} />, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
  { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Real humans, fast replies' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setProducts(PRODUCTS);
    setLoading(false);
  }, []);

  const bestsellers = products.filter(p => p.badge === 'BESTSELLER').slice(0, 8);
  const displayProducts = bestsellers.length >= 8 ? bestsellers : products.slice(0, 8);

  return (
    <div style={{ background: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1556228578-8e89ef1b2120?w=1800&fit=crop"
            alt="Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.1) 100%)' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ maxWidth: '560px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#F0FAF5', border: '1px solid #B8E0D2',
              borderRadius: '20px', padding: '6px 16px', marginBottom: '32px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2D9E6B' }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A5F3D', letterSpacing: '0.5px' }}>Clinically formulated · 50,000+ verified reviews</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(42px, 6vw, 76px)',
              fontWeight: '800', lineHeight: 1.05,
              color: '#1A1A1A', marginBottom: '24px',
              letterSpacing: '-2px',
            }}>
              Visible Results<br />
              <span style={{ color: '#B8E0D2', WebkitTextStroke: '2px #1A1A1A' }}>In 28 Days.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.7, marginBottom: '40px', maxWidth: '420px' }}>
              Skincare and beauty devices that work at a cellular level — not just on the surface.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/collections/skincare" style={{
                background: '#1A1A1A', color: '#fff', textDecoration: 'none',
                padding: '17px 36px', borderRadius: '4px',
                fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}
              >Shop Skincare <ArrowRight size={14} /></Link>
              <Link to="/collections/tools-devices" style={{
                background: 'transparent', color: '#1A1A1A', textDecoration: 'none',
                padding: '17px 36px', borderRadius: '4px', border: '1.5px solid #1A1A1A',
                fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>View Devices</Link>
            </div>
            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
              <div style={{ display: 'flex' }}>
                {['S', 'M', 'A', 'P'].map((l, i) => (
                  <div key={i} style={{
                    width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #fff',
                    background: ['#FCE4EC', '#B8E0D2', '#E0D4FC', '#FCF4C8'][i],
                    marginLeft: i > 0 ? '-10px' : '0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700', color: '#1A1A1A', zIndex: 4 - i,
                    position: 'relative',
                  }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#F5A623" stroke="#F5A623" />)}
                </div>
                <p style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>50,000+ happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section style={{ padding: '96px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Explore</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px' }}>Shop By Category</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              style={{ textDecoration: 'none', display: 'block', borderRadius: '12px', overflow: 'hidden', position: 'relative', aspectRatio: '3/4', cursor: 'pointer' }}
              onMouseEnter={e => {
                e.currentTarget.querySelector('.cat-img').style.transform = 'scale(1.08)';
                e.currentTarget.querySelector('.cat-overlay').style.background = 'linear-gradient(to top, rgba(26,26,26,0.75) 0%, rgba(0,0,0,0) 60%)';
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('.cat-img').style.transform = 'scale(1)';
                e.currentTarget.querySelector('.cat-overlay').style.background = 'linear-gradient(to top, rgba(26,26,26,0.6) 0%, rgba(0,0,0,0) 50%)';
              }}
            >
              <img className="cat-img" src={cat.img} alt={cat.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              <div className="cat-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.6) 0%, rgba(0,0,0,0) 50%)', transition: 'background 0.3s' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '20px', right: '20px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{cat.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section style={{ padding: '0 24px 96px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Most Loved</p>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px' }}>Bestsellers</h2>
          </div>
          <Link to="/collections/all" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1A1A1A', textDecoration: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', borderBottom: '1.5px solid #1A1A1A', paddingBottom: '2px' }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: '#F5F5F5', borderRadius: '12px', aspectRatio: '0.8', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* WHY US */}
      <section style={{ background: '#FAFAFA', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px' }}>Why Choose BYLVRA</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: '#F0FAF5', border: '1px solid #B8E0D2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', color: '#2D9E6B',
                }}>{badge.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>{badge.title}</h3>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section style={{ position: 'relative', minHeight: '520px', display: 'flex', alignItems: 'center', overflow: 'hidden', margin: '0' }}>
        <img
          src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?w=1800&fit=crop"
          alt="Editorial"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.55)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ maxWidth: '560px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>The Science Issue</p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '800', lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '24px' }}>
              Formulated for<br />real skin. Real results.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '36px', lineHeight: 1.7 }}>
              Every product in the BYLVRA range is developed around clinical-grade actives at proven concentrations.
            </p>
            <Link to="/pages/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', color: '#1A1A1A', textDecoration: 'none',
              padding: '16px 32px', borderRadius: '4px',
              fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#B8E0D2' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >Our Story <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '96px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Real Results</p>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px' }}>What Our Customers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: '#FAFAFA', border: '1px solid #F0F0F0',
              borderRadius: '16px', padding: '32px',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.background = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#FAFAFA' }}
            >
              <div style={{ display: 'flex', gap: '2px', marginBottom: '20px' }}>
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#F5A623" stroke="#F5A623" />)}
              </div>
              <p style={{ fontSize: '16px', color: '#1A1A1A', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '24px' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: ['#FCE4EC', '#B8E0D2', '#E0D4FC'][i],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '700', color: '#1A1A1A',
                }}>{t.avatar}</div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A' }}>{t.name}</p>
                  <p style={{ fontSize: '12px', color: '#B8E0D2', fontWeight: '600' }}>Verified: {t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: '#1A1A1A', padding: '80px 24px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '16px' }}>BYLVRA Insiders</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#fff', letterSpacing: '-1px', marginBottom: '16px' }}>
            Get 15% Off Your First Order
          </h2>
          <p style={{ color: '#888', fontSize: '15px', marginBottom: '36px', lineHeight: 1.6 }}>
            Subscribe for exclusive access to new launches, clinical insights, and subscriber-only offers.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
        @media (max-width: 768px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const { NewsletterSubscriber } = await import('../api/entities');
      await NewsletterSubscriber.create({ email, source: 'homepage', discount_sent: false });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
  };

  if (submitted) return (
    <div style={{ color: '#B8E0D2', fontSize: '16px', fontWeight: '600', padding: '20px' }}>
      ✓ You're in! Check your email for your 10% off code.
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0', maxWidth: '420px', margin: '0 auto' }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        style={{
          flex: 1, border: 'none', padding: '16px 20px',
          fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif',
          borderRadius: '4px 0 0 4px', background: '#2A2A2A', color: '#fff',
        }}
      />
      <button type="submit" style={{
        background: '#B8E0D2', color: '#1A1A1A', border: 'none',
        padding: '16px 28px', cursor: 'pointer',
        fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
        borderRadius: '0 4px 4px 0', whiteSpace: 'nowrap',
      }}>
        Subscribe
      </button>
    </form>
  );
}
