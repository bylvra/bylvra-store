import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../api/entities';
import ProductCard from '../components/ui/ProductCard';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS } from '../api/productsData';

const CATEGORY_META = {
  'skincare': {
    title: 'Skincare',
    subtitle: 'Clinical-grade actives. Proven concentrations. Real results.',
    img: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=1600',
    filter: 'Skincare'
  },
  'tools-devices': {
    title: 'Tools & Devices',
    subtitle: 'Professional-grade technology engineered for home use.',
    img: 'https://images.pexels.com/photos/7755186/pexels-photo-7755186.jpeg?auto=compress&cs=tinysrgb&w=1600',
    filter: 'Tools & Devices'
  },
  'hair': {
    title: 'Hair',
    subtitle: 'Science-backed solutions for growth, scalp health, and shine.',
    img: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600',
    filter: 'Hair'
  },
  'body': {
    title: 'Body',
    subtitle: 'IPL, exfoliation, and body treatments that deliver.',
    img: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1600',
    filter: 'Body'
  },
  'wellness': {
    title: 'Wellness',
    subtitle: 'Recovery, posture, and sleep tools backed by research.',
    img: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1600',
    filter: 'Wellness'
  },
  'all': {
    title: 'All Products',
    subtitle: 'Every BYLVRA product — clinically formulated, results-driven.',
    img: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=1600',
    filter: null
  }
};

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rating', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
];

export default function CollectionPage() {
  const { category } = useParams();
  const meta = CATEGORY_META[category] || CATEGORY_META['all'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const filtered = meta.filter ? PRODUCTS.filter(p => p.category === meta.filter) : PRODUCTS;
    setProducts(filtered);
    setLoading(false);
  }, [category]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.review_count - a.review_count;
    return 0;
  });

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
        <img src={meta.img} alt={meta.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.5)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '12px' }}>{meta.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', maxWidth: '500px' }}>{meta.subtitle}</p>
        </div>
      </div>

      {/* Breadcrumb + Sort */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#1A1A1A' }}>{meta.title}</span>
          <span style={{ color: '#BBB' }}>({sorted.length} products)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={14} style={{ color: '#888' }} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ border: '1px solid #E0E0E0', borderRadius: '4px', padding: '8px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: '#fff' }}
          >
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 96px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#F5F5F5', borderRadius: '12px', aspectRatio: '0.8', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontSize: '18px', color: '#888', marginBottom: '24px' }}>No products in this category yet.</p>
            <Link to="/collections/all" style={{ color: '#1A1A1A', fontWeight: '700' }}>View All Products →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {sorted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
    </div>
  );
}
