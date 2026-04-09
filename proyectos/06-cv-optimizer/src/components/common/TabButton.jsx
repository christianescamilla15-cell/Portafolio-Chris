import React from 'react';
import { COLORS } from '../../constants/colors.js';

export default function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      aria-label={typeof children === 'string' ? children : undefined}
      style={{
        background: active ? COLORS.accentDim : 'rgba(255,255,255,0.03)',
        color: active ? COLORS.accent : COLORS.textDim,
        border: `1px solid ${active ? 'rgba(139,92,246,0.3)' : COLORS.border}`,
        borderRadius: 12,
        padding: '8px 20px',
        cursor: 'pointer',
        fontFamily: 'DM Sans',
        fontWeight: 600,
        fontSize: 14,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(12px)',
        boxShadow: active ? '0 0 20px rgba(139,92,246,0.1)' : 'none',
      }}
    >
      {children}
    </button>
  );
}
