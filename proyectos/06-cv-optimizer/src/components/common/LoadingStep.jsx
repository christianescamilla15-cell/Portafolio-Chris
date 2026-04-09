import React from 'react';
import { COLORS } from '../../constants/colors.js';

const LoadingStep = React.memo(function LoadingStep({ text, done }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      color: done ? COLORS.green : COLORS.textDim,
      fontSize: 14, fontFamily: 'DM Mono',
      padding: '6px 0',
      transition: 'color 0.3s',
    }}>
      <span style={{ fontSize: 16 }}>{done ? '\u2713' : '\u25CB'}</span>
      {text}
    </div>
  );
});

export default LoadingStep;
