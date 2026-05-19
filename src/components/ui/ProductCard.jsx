import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Star, ShoppingBag, Eye } from 'lucide-react';

function StarRating({ rating, small }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={small ? 10 : 12}
          fill={i <= Math.round(rating) ? '#F5A623' : 'none'}
          stroke={i <= Math.round(rating) ? '#F5A623' : '#ccc'}
        />
      ))}
    </div>
  );
}

const BADGE_COLORS = {
  BESTSELLER: { bg: '#1A1A1A', text: '#fff' },
  NEW: { bg: '#B8E0D2', text: '#1A1A1A' },
  SALE: { bg: '#FCE4EC', text: '#C2185B' },
};

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.12)'
          : '0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.04)',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 2,
          background: BADGE_COLORS[product.badge]?.bg || '#1A1A1A',
          color: BADGE_COLORS[product.badge]?.text || '#fff',
          fontSize: '9px', fontWeight: '800', letterSpacing: '1.5px',
          padding: '4px 8px', borderRadius: '3px', textTransform: 'uppercase',
        }}>
          {product.badge}
        </div>
      )}

      {/* Quick view */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 2,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
      }}>
        <Link to={`/products/${product.slug}`}
          style={{
            background: '#fff', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)', cursor: 'pointer', textDecoration: 'none', color: '#1A1A1A',
          }}>
          <Eye size={14} />
        </Link>
      </div>

      {/* Image */}
      <Link to={`/products/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{
          position: 'relative', paddingTop: '110%', overflow: 'hidden', background: '#F8F4F4',
        }}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.4s ease',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '11px', color: '#B8B8B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          {product.category}
        </p>
        <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '15px', fontWeight: '600', color: '#1A1A1A', marginBottom: '8px',
            lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{product.name}</h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: '12px', color: '#888' }}>{product.rating} ({product.review_count?.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '17px', fontWeight: '700', color: '#1A1A1A' }}>${product.price}</span>
          {product.compare_at_price && (
            <span style={{ fontSize: '13px', color: '#BBB', textDecoration: 'line-through' }}>${product.compare_at_price}</span>
          )}
          {discount > 0 && (
            <span style={{ fontSize: '11px', color: '#C2185B', fontWeight: '600' }}>-{discount}%</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%',
            background: hovered ? '#1A1A1A' : '#F5F5F5',
            color: hovered ? '#fff' : '#1A1A1A',
            border: 'none', borderRadius: '6px',
            padding: '11px', cursor: 'pointer',
            fontSize: '12px', fontWeight: '700', letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          }}
        >
          <ShoppingBag size={14} />
          {adding ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
