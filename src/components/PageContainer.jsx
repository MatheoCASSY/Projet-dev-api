import React from 'react';

export default function PageContainer({ children }) {
  return (
    <div className="container py-4 home-root" style={{ background: '#0b0b0b', minHeight: '100vh', color: '#fff' }}>
      {children}
    </div>
  );
}
