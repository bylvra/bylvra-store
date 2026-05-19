import React, { useState } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div style={{
      background: '#1A1A1A',
      color: '#fff',
      textAlign: 'center',
      padding: '10px 20px',
      fontSize: '12px',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      fontWeight: '500',
      position: 'relative',
    }}>
      <span>✦ Free Shipping Over $50 &nbsp;&nbsp;|&nbsp;&nbsp; 30-Day Guarantee &nbsp;&nbsp;|&nbsp;&nbsp; Clinically Formulated ✦</span>
      <button
        onClick={() => setVisible(false)}
        style={{
          position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', opacity: 0.6
        }}
      >×</button>
    </div>
  );
}
