import React from 'react';
import { COLORS } from '../../constants/colors.js';

const Card = React.memo(function Card({ color, borderColor, bgColor, title, children, style }) {
  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 16,
      padding: '14px 16px',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      ...style,
    }}>
      {title && (
        <div style={{ color, fontWeight: 600, fontSize: 14, marginBottom: 8, fontFamily: 'DM Sans' }}>
          {title}
        </div>
      )}
      <div style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.5, fontFamily: 'DM Sans' }}>
        {children}
      </div>
    </div>
  );
});

export default Card;
