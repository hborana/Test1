import React from 'react';

export default function TimeDisplay({ data }) {
  const { time, date, timezone } = data;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '300px',
      margin: '8px 0',
      boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🕐</div>
      <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
        {time}
      </div>
      <div style={{ fontSize: '18px', marginBottom: '8px', opacity: 0.9 }}>
        {date}
      </div>
      <div style={{ fontSize: '14px', opacity: 0.8 }}>
        📍 {timezone}
      </div>
    </div>
  );
}
