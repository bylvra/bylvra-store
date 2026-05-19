import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Skincare', href: '/collections/skincare' },
  { label: 'Tools & Devices', href: '/collections/tools-devices' },
  { label: 'Hair', href: '/collections/hair' },
  { label: 'Body', href: '/collections/body' },
  { label: 'Wellness', href: '/collections/wellness' },
];

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26,26,26,0.08)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '68px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flex: '0 0 auto' }}>
            <span style={{
              fontSize: '22px', fontWeight: '700', letterSpacing: '3px',
              color: '#1A1A1A', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif'
            }}>BYLVRA</span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} style={{
                textDecoration: 'none', color: '#1A1A1A', fontSize: '13px',
                fontWeight: '500', letterSpacing: '0.5px',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
                paddingBottom: '2px',
                borderBottom: '1px solid transparent',
              }}
                onMouseEnter={e => e.target.style.borderBottomColor = '#1A1A1A'}
                onMouseLeave={e => e.target.style.borderBottomColor = 'transparent'}
              >{link.label}</Link>
            ))}
          </div>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#1A1A1A' }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link to="/account" style={{ color: '#1A1A1A', display: 'flex' }}>
              <User size={20} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#1A1A1A', position: 'relative' }}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#1A1A1A', color: '#fff',
                  width: '18px', height: '18px', borderRadius: '50%',
                  fontSize: '10px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cartCount}</span>
              )}
            </button>
            {/* Mobile menu toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A', display: 'none' }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ borderTop: '1px solid rgba(26,26,26,0.08)', padding: '16px 24px', background: '#fff' }}>
            <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                autoFocus
                style={{
                  flex: 1, border: '1px solid #ddd', borderRadius: '4px',
                  padding: '10px 16px', fontSize: '14px', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <button type="submit" style={{
                background: '#1A1A1A', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: '4px', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px',
              }}>Search</button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: '#fff', borderTop: '1px solid rgba(26,26,26,0.08)',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: 'none', color: '#1A1A1A', fontSize: '16px',
                  fontWeight: '500', letterSpacing: '0.5px',
                }}
              >{link.label}</Link>
            ))}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/pages/about" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#666', fontSize: '14px' }}>About Us</Link>
              <Link to="/pages/contact" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#666', fontSize: '14px' }}>Contact</Link>
              <Link to="/pages/faq" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#666', fontSize: '14px' }}>FAQ</Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
