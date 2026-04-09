import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../constants/colors.js';

const CircularGauge = React.memo(function CircularGauge({ score, size = 160 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? COLORS.green : score >= 60 ? COLORS.yellow : COLORS.red;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + (score - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
        <text
          x={size / 2} y={size / 2 - 8}
          textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="36" fontWeight="700" fontFamily="DM Sans"
        >
          {displayScore}%
        </text>
        <text
          x={size / 2} y={size / 2 + 20}
          textAnchor="middle" dominantBaseline="middle"
          fill={COLORS.textDim} fontSize="12" fontFamily="DM Sans"
        >
          Match Score
        </text>
      </svg>
    </div>
  );
});

export default CircularGauge;
