import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../constants/colors.js';
import { INDUSTRY_BENCHMARKS, INDUSTRY_LABELS, detectIndustry } from '../../constants/benchmarks.js';

const APPLE_EASE = [0.16, 1, 0.3, 1];

function AnimatedBar({ targetWidth, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(targetWidth), delay * 1000 + 100);
    return () => clearTimeout(timer);
  }, [targetWidth, delay]);
  return (
    <div style={{
      height: '100%',
      width: `${Math.min(100, width)}%`,
      background: color,
      borderRadius: 4,
      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: `0 0 8px ${color}30`,
    }}
      role="progressbar"
      aria-valuenow={targetWidth}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}

export default function IndustryBenchmark({ score, jobText, isES }) {
  const industry = useMemo(() => detectIndustry(jobText), [jobText]);
  const benchmark = INDUSTRY_BENCHMARKS[industry];
  const label = (isES ? INDUSTRY_LABELS.es : INDUSTRY_LABELS.en)[industry];

  const getScoreColor = (userScore, avg) => {
    if (userScore >= avg + 10) return COLORS.green;
    if (userScore >= avg - 5) return COLORS.yellow;
    return COLORS.red;
  };

  const scoreColor = getScoreColor(score, benchmark.avg);
  const statusText = score >= benchmark.avg + 10
    ? (isES ? 'Por encima del promedio' : 'Above average')
    : score >= benchmark.avg - 5
      ? (isES ? 'En el promedio' : 'Average')
      : (isES ? 'Por debajo del promedio' : 'Below average');

  const bars = [
    { label: isES ? 'Tu CV' : 'Your CV', value: score, color: scoreColor },
    { label: isES ? 'Promedio de la industria' : 'Industry average', value: benchmark.avg, color: COLORS.textDim },
    { label: isES ? 'Top 10%' : 'Top 10%', value: benchmark.top10, color: COLORS.accent },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: APPLE_EASE }}
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 20,
        backdropFilter: 'blur(12px)',
      }}
      aria-label={isES ? 'Comparacion con la industria' : 'Industry benchmark comparison'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>
          {isES ? 'Benchmark de la industria' : 'Industry Benchmark'}
        </h4>
        <div style={{
          fontSize: 12,
          color: scoreColor,
          fontWeight: 600,
          background: `${scoreColor}15`,
          padding: '4px 10px',
          borderRadius: 8,
        }}>
          {label} — {statusText}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bars.map((bar, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + idx * 0.08, duration: 0.4, ease: APPLE_EASE }}
            aria-label={`${bar.label}: ${bar.value}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: COLORS.textDim }}>{bar.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: bar.color }}>{bar.value}%</span>
            </div>
            <div style={{
              height: 8,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <AnimatedBar targetWidth={bar.value} color={bar.color} delay={0.15 + idx * 0.1} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
