import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../../constants/colors.js';

const APPLE_EASE = [0.16, 1, 0.3, 1];

function getKeywordSize(weight, isMatched, baseSize) {
  if (isMatched) return baseSize + weight * 4;
  return baseSize + weight * 2;
}

export default function KeywordCloud({ results, isES }) {
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const keywords = useMemo(() => {
    if (!results) return [];
    const items = [];
    for (const s of results.strengths) {
      if (s.type !== 'skill') continue;
      items.push({ term: s.keyword, matched: true, weight: s.weight, detail: s.detail });
    }
    for (const w of results.weaknesses) {
      if (w.type !== 'skill') continue;
      items.push({ term: w.keyword, matched: false, weight: w.weight, detail: w.detail });
    }
    return items;
  }, [results]);

  if (keywords.length === 0) return null;

  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 20,
        backdropFilter: 'blur(12px)',
      }}
      aria-label={isES ? 'Nube de palabras clave' : 'Keyword cloud'}
    >
      <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: '0 0 12px 0' }}>
        {isES ? 'Nube de palabras clave' : 'Keyword Cloud'}
      </h4>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 11, color: COLORS.textMuted }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.green, display: 'inline-block', boxShadow: `0 0 6px ${COLORS.green}40` }} />
          {isES ? 'Encontrada' : 'Matched'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.red, display: 'inline-block', boxShadow: `0 0 6px ${COLORS.red}40` }} />
          {isES ? 'Faltante' : 'Missing'}
        </span>
      </div>

      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
          justifyContent: 'center', alignItems: 'center', minHeight: 80,
        }}
        role="list"
        aria-label={isES ? 'Lista de palabras clave' : 'Keyword list'}
      >
        {keywords.map((kw, idx) => {
          const fontSize = getKeywordSize(kw.weight, kw.matched, 12);
          const color = kw.matched ? COLORS.green : COLORS.red;
          const bgColor = kw.matched ? COLORS.greenBg : COLORS.redBg;
          const borderColor = kw.matched ? COLORS.greenBorder : COLORS.redBorder;
          const isSelected = selectedKeyword === idx;

          return (
            <motion.button
              key={idx}
              role="listitem"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03, duration: 0.35, ease: APPLE_EASE }}
              onClick={() => setSelectedKeyword(isSelected ? null : idx)}
              aria-label={`${kw.term}: ${kw.matched ? (isES ? 'encontrada' : 'matched') : (isES ? 'faltante' : 'missing')}, ${isES ? 'peso' : 'weight'} ${kw.weight}`}
              aria-pressed={isSelected}
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize,
                fontWeight: kw.weight >= 1.5 ? 700 : 500,
                color,
                background: isSelected ? `${color}15` : bgColor,
                border: `1px solid ${isSelected ? color : borderColor}`,
                borderRadius: 20,
                cursor: 'pointer',
                fontFamily: 'DM Sans',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isSelected ? `0 0 12px ${color}20` : 'none',
              }}
            >
              {kw.term}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedKeyword !== null && keywords[selectedKeyword] && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.3, ease: APPLE_EASE }}
            style={{
              marginTop: 12,
              padding: 12,
              background: COLORS.bgInput,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              fontSize: 12,
              color: COLORS.textDim,
              lineHeight: 1.5,
              overflow: 'hidden',
            }}
            role="status"
            aria-live="polite"
          >
            <div style={{ fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
              {keywords[selectedKeyword].term}
            </div>
            <div style={{ marginBottom: 4 }}>
              {isES ? 'Estado' : 'Status'}:{' '}
              <span style={{ color: keywords[selectedKeyword].matched ? COLORS.green : COLORS.red, fontWeight: 600 }}>
                {keywords[selectedKeyword].matched
                  ? (isES ? 'Encontrada en tu CV' : 'Found in your CV')
                  : (isES ? 'No encontrada en tu CV' : 'Not found in your CV')}
              </span>
            </div>
            <div style={{ marginBottom: 4 }}>
              {isES ? 'Importancia' : 'Importance'}:{' '}
              <span style={{ fontWeight: 600 }}>
                {keywords[selectedKeyword].weight >= 2
                  ? (isES ? 'Alta (requerida)' : 'High (required)')
                  : keywords[selectedKeyword].weight >= 1.5
                    ? (isES ? 'Media' : 'Medium')
                    : (isES ? 'Baja (deseable)' : 'Low (desirable)')}
              </span>
            </div>
            <div>{keywords[selectedKeyword].detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
