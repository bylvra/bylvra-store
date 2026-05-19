import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../api/entities';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ui/ProductCard';
import { Star, Shield, Truck, RotateCcw, ChevronDown, ChevronRight, Clock, Package, Zap } from 'lucide-react';

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => <Star key={i} size={size} fill={i <= Math.round(rating) ? '#F5A623' : 'none'} stroke={i <= Math.round(rating) ? '#F5A623' : '#ccc'} />)}
    </div>
  );
}

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F0F0F0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A' }}>{title}</span>
        <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', color: '#888', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ paddingBottom: '20px', fontSize: '14px', color: '#555', lineHeight: 1.8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

const REVIEWS = [
  { name: 'Amanda K.', rating: 5, date: 'March 2025', verified: true, text: 'I was skeptical, but the results after 3 weeks were undeniable. My skin texture improved so much that friends started asking what I changed in my routine. 100% worth it.' },
  { name: 'Sarah J.', rating: 5, date: 'February 2025', verified: true, text: 'This is the first product in years that actually delivered what it promised. I use it every night and my fine lines have visibly softened. The formula feels luxurious too.' },
  { name: 'Melissa T.', rating: 5, date: 'January 2025', verified: true, text: 'My dermatologist was impressed at my last appointment. She asked what I was using and I showed her this. She said the formulation makes sense. High praise from a derm.' },
  { name: 'Rachel W.', rating: 5, date: 'April 2025', verified: true, text: 'I\'ve spent thousands on beauty products over the years. This delivers better results than products I\'ve paid 5x as much for. The delivery was fast and packaging is beautiful.' },
  { name: 'Jennifer C.', rating: 5, date: 'March 2025', verified: true, text: 'After two weeks, my partner asked if I\'d had something done. That\'s the best compliment. The results are that visible. I\'m buying backups now, this is my ride-or-die.' },
];

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 47, seconds: 22 });

  useEffect(() => {
    Product.list().then(data => {
      const p = data.find(p => p.slug === slug);
      setProduct(p);
      setAllProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 5; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setAdding(false), 1000);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid #E0E0E0', borderTop: '2px solid #1A1A1A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Product not found</h2>
      <Link to="/" style={{ color: '#1A1A1A' }}>← Back to Home</Link>
    </div>
  );

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  const youMayAlsoLike = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 10);
  const deliveryStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      {/* Breadcrumbs */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={12} />
        <Link to={`/collections/${product.category?.toLowerCase().replace(' & ', '-').replace(' ', '-')}`} style={{ color: '#888', textDecoration: 'none' }}>{product.category}</Link>
        <ChevronRight size={12} />
        <span style={{ color: '#1A1A1A' }}>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }} className="product-grid">
        {/* Gallery */}
        <div style={{ position: 'sticky', top: '88px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '12px', background: '#F8F4F4', aspectRatio: '1' }}>
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {(product.images || []).concat([
              'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300',
              'https://images.unsplash.com/photo-1556228578-8e89ef1b2120?w=300',
            ]).slice(0, 5).map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(i)}
                style={{
                  width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden',
                  cursor: 'pointer', background: '#F8F4F4',
                  border: selectedImage === i ? '2px solid #1A1A1A' : '2px solid transparent',
                  transition: 'border 0.2s',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.badge && (
            <span style={{
              background: product.badge === 'BESTSELLER' ? '#1A1A1A' : product.badge === 'NEW' ? '#B8E0D2' : '#FCE4EC',
              color: product.badge === 'BESTSELLER' ? '#fff' : product.badge === 'NEW' ? '#1A1A1A' : '#C2185B',
              fontSize: '10px', fontWeight: '800', letterSpacing: '2px', padding: '4px 10px',
              borderRadius: '3px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '16px',
            }}>{product.badge}</span>
          )}
          <h1 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px', marginBottom: '12px', lineHeight: 1.15 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <StarRating rating={product.rating} size={16} />
            <span style={{ fontSize: '14px', color: '#888' }}>
              <strong style={{ color: '#1A1A1A' }}>{product.rating}</strong> stars — {product.review_count?.toLocaleString()} reviews
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#1A1A1A' }}>${product.price}</span>
            {product.compare_at_price && (
              <span style={{ fontSize: '20px', color: '#CCC', textDecoration: 'line-through' }}>${product.compare_at_price}</span>
            )}
            {discount > 0 && (
              <span style={{ background: '#FCE4EC', color: '#C2185B', fontSize: '13px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px' }}>
                Save {discount}%
              </span>
            )}
          </div>

          {/* Urgency timer */}
          <div style={{ background: '#FFF8E7', border: '1px solid #FFE082', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#92400E', fontWeight: '600' }}>
              Sale ends in&nbsp;
              <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                {String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}:{String(timeLeft.seconds).padStart(2,'0')}
              </span>
            </span>
          </div>

          {/* Stock */}
          {product.stock_count <= 10 && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 16px', marginBottom: '20px', fontSize: '13px', color: '#991B1B', fontWeight: '600' }}>
              ⚡ Only {product.stock_count} left in stock — order soon
            </div>
          )}

          {/* Short description */}
          <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7, marginBottom: '28px' }}>
            {product.short_description}
          </p>

          {/* Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Quantity</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #E0E0E0', borderRadius: '6px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#1A1A1A' }}>−</button>
              <span style={{ padding: '10px 16px', fontSize: '15px', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#1A1A1A' }}>+</button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1, minWidth: '180px',
                background: adding ? '#2D9E6B' : '#1A1A1A',
                color: '#fff', border: 'none', borderRadius: '6px',
                padding: '17px 24px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >
              {adding ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button style={{
              flex: 1, minWidth: '180px',
              background: '#FCE4EC', color: '#1A1A1A', border: 'none', borderRadius: '6px',
              padding: '17px 24px', cursor: 'pointer',
              fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}>
              Buy It Now
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '16px', padding: '20px 0', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[{ icon: <Shield size={16} />, text: 'Secure Checkout' }, { icon: <Truck size={16} />, text: 'Free Shipping $50+' }, { icon: <RotateCcw size={16} />, text: '30-Day Returns' }].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', fontWeight: '500' }}>
                <span style={{ color: '#B8E0D2' }}>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>

          {/* Estimated delivery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FFF8', border: '1px solid #B8E0D2', borderRadius: '8px', padding: '12px 16px', marginBottom: '28px' }}>
            <Package size={16} style={{ color: '#2D9E6B' }} />
            <span style={{ fontSize: '13px', color: '#1A5F3D', fontWeight: '500' }}>
              Order now — estimated delivery by <strong>{deliveryStr}</strong>
            </span>
          </div>

          {/* Description Accordion */}
          <AccordionItem title="Description & Benefits">
            <p style={{ marginBottom: '16px' }}>{product.description}</p>
            {product.benefits?.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
                {product.benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <Zap size={14} style={{ color: '#B8E0D2', marginTop: '2px', flexShrink: 0 }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </AccordionItem>

          <AccordionItem title="Key Ingredients / Technology">
            <p>{product.ingredients}</p>
          </AccordionItem>

          <AccordionItem title="What's In The Box">
            <p>{product.whats_in_box}</p>
            <p style={{ marginTop: '12px', color: '#2D9E6B', fontWeight: '600' }}>✓ 30-day satisfaction guarantee on every order</p>
          </AccordionItem>

          <AccordionItem title="Shipping & Returns">
            <p style={{ marginBottom: '10px' }}><strong>Processing:</strong> 1–3 business days</p>
            <p style={{ marginBottom: '10px' }}><strong>Standard shipping:</strong> 7–15 business days</p>
            <p style={{ marginBottom: '10px' }}><strong>Express shipping:</strong> 5–10 business days</p>
            <p><strong>Returns:</strong> 30-day window. Items must be in original, unused condition. Email hello@lumara.com to initiate.</p>
          </AccordionItem>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ background: '#FAFAFA', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1A1A1A', marginBottom: '8px' }}>Customer Reviews</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <StarRating rating={product.rating} size={18} />
                <span style={{ fontSize: '15px', color: '#888' }}>{product.rating} out of 5 — {product.review_count?.toLocaleString()} reviews</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: '#1A1A1A', marginBottom: '2px' }}>{r.name}</p>
                    <p style={{ fontSize: '12px', color: '#888' }}>{r.date}</p>
                  </div>
                  {r.verified && <span style={{ background: '#F0FAF5', color: '#2D9E6B', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.5px' }}>✓ VERIFIED</span>}
                </div>
                <StarRating rating={r.rating} size={13} />
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, marginTop: '12px' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {youMayAlsoLike.length > 0 && (
        <div style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A1A', marginBottom: '40px' }}>You May Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {youMayAlsoLike.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
