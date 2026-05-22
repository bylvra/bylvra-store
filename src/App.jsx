import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';

import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import CartDrawer from './components/layout/CartDrawer';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import TrackOrder from './pages/TrackOrder';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CJImporter from './pages/CJImporter';
import EmailCapturePopup from './components/layout/EmailCapturePopup';
import FreeShippingBar from './components/ui/FreeShippingBar';

function Layout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <FreeShippingBar />
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <Footer />
    </>
  );
}

function CheckoutLayout({ children }) {
  return (
    <>
      <CartDrawer />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <EmailCapturePopup />
        <Routes>
          {/* Checkout - no nav/footer */}
          <Route path="/checkout" element={<CheckoutLayout><Checkout /></CheckoutLayout>} />
          <Route path="/order-confirmation" element={<CheckoutLayout><OrderConfirmation /></CheckoutLayout>} />

          {/* Main layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/collections/:category" element={<Layout><CollectionPage /></Layout>} />
          <Route path="/products/:slug" element={<Layout><ProductPage /></Layout>} />
          <Route path="/pages/about" element={<Layout><About /></Layout>} />
          <Route path="/pages/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/pages/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/pages/shipping" element={<Layout><ShippingPolicy /></Layout>} />
          <Route path="/pages/returns" element={<Layout><ReturnsPolicy /></Layout>} />
          <Route path="/pages/track-order" element={<Layout><TrackOrder /></Layout>} />
          <Route path="/pages/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/pages/terms" element={<Layout><TermsOfService /></Layout>} />

          {/* Admin */}
          <Route path="/admin/import" element={<CJImporter />} />

          {/* Catch-all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 24px', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '16px' }}>404</p>
      <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-2px', marginBottom: '16px' }}>Page Not Found</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ display: 'inline-block', background: '#1A1A1A', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Back to Home</a>
    </div>
  );
}
