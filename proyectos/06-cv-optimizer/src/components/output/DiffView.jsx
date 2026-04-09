import React, { useState, useRef, useCallback, useMemo } from 'react';
import { COLORS } from '../../constants/colors.js';
import { computeDiff } from '../../utils/diffEngine.js';

const DIFF_COLORS = {
  added: { bg: COLORS.greenBg, color: COLORS.green, border: COLORS.greenBorder },
  removed: { bg: COLORS.redBg, color: COLORS.red, border: COLORS.redBorder },
  modified: { bg: COLORS.yellowBg, color: COLORS.yellow, border: COLORS.yellowBorder },
  unchanged: { bg: 'transparent', color: COLORS.textDim, border: 'transparent' },
};

export default function DiffView({ results, cvText, isES }) {
  const [viewMode, setViewMode] = useState('diff');
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const syncingRef = useRef(false);

  const originalLines = useMemo(() => (cvText || '').split('\n'), [cvText]);
  const optimizedLines = useMemo(
    () => (results?.optimizedCV?.text || '').split('\n'),
    [results]
  );
  const diffResult = useMemo(
    () => computeDiff(originalLines, optimizedLines),
    [originalLines, optimizedLines]
  );

  const stats = useMemo(() => {
    let additions = 0;
    let removals = 0;
    let changes = 0;
    for (const entry of diffResult) {
      if (entry.type === 'added') additions++;
      else if (entry.type === 'removed') removals++;
      else if (entry.type === 'modified') changes++;
    }
    return { additions, removals, changes };
  }, [diffResult]);

  const handleScroll = useCallback((source) => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    const sourceEl = source === 'left' ? leftRef.current : rightRef.current;
    const targetEl = source === 'left' ? rightRef.current : leftRef.current;
    if (sourceEl && targetEl) {
      targetEl.scrollTop = sourceEl.scrollTop;
    }
    requestAnimationFrame(() => {
      syncingRef.current = false;
    });
  }, []);

  const panelStyle = {
    flex: 1,
    minWidth: 0,
    background: COLORS.bgInput,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '0 0 8px 8px',
    padding: 12,
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    lineHeight: 1.7,
    maxHeight: 600,
    overflowY: 'auto',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }} role="group" aria-label={isES ? 'Modo de vista' : 'View mode'}>
          <button
            onClick={() => setViewMode('diff')}
            aria-label={isES ? 'Vista de diferencias' : 'Diff view'}
            aria-pressed={viewMode === 'diff'}
            style={{
              padding: '6px 16px',
              background: viewMode === 'diff' ? COLORS.accentDim : 'transparent',
              color: viewMode === 'diff' ? COLORS.accent : COLORS.textDim,
              border: `1px solid ${viewMode === 'diff' ? COLORS.accent : COLORS.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {isES ? 'Diferencias' : 'Diff'}
          </button>
          <button
            onClick={() => setViewMode('full')}
            aria-label={isES ? 'Vista completa' : 'Full view'}
            aria-pressed={viewMode === 'full'}
            style={{
              padding: '6px 16px',
              background: viewMode === 'full' ? COLORS.accentDim : 'transparent',
              color: viewMode === 'full' ? COLORS.accent : COLORS.textDim,
              border: `1px solid ${viewMode === 'full' ? COLORS.accent : COLORS.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {isES ? 'Completa' : 'Full'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <span style={{ color: COLORS.green }} aria-label={isES ? `${stats.additions} adiciones` : `${stats.additions} additions`}>
            +{stats.additions} {isES ? 'adiciones' : 'additions'}
          </span>
          <span style={{ color: COLORS.red }} aria-label={isES ? `${stats.removals} eliminaciones` : `${stats.removals} removals`}>
            -{stats.removals} {isES ? 'eliminaciones' : 'removals'}
          </span>
          <span style={{ color: COLORS.yellow }} aria-label={isES ? `${stats.changes} cambios` : `${stats.changes} changes`}>
            ~{stats.changes} {isES ? 'cambios' : 'changes'}
          </span>
        </div>
      </div>

      {/* Panels */}
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Left — Original */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: COLORS.textDim,
            padding: '8px 12px',
            background: COLORS.bgCard, borderRadius: '8px 8px 0 0',
            border: `1px solid ${COLORS.border}`, borderBottom: 'none',
          }}>
            {isES ? 'CV Original' : 'Original CV'}
          </div>
          <div
            ref={leftRef}
            onScroll={() => handleScroll('left')}
            style={panelStyle}
            aria-label={isES ? 'CV Original' : 'Original CV'}
          >
            {viewMode === 'diff'
              ? diffResult.map((entry, idx) => {
                  if (entry.type === 'added') {
                    return (
                      <div key={idx} style={{ height: '1.7em', color: COLORS.textMuted, opacity: 0.3 }}>
                        {'\u00A0'}
                      </div>
                    );
                  }
                  const colors = DIFF_COLORS[entry.type];
                  return (
                    <div key={idx} style={{
                      background: colors.bg,
                      color: colors.color,
                      padding: '1px 4px',
                      borderRadius: 2,
                      borderLeft: entry.type !== 'unchanged' ? `3px solid ${colors.border}` : '3px solid transparent',
                    }}>
                      {entry.original || '\u00A0'}
                    </div>
                  );
                })
              : originalLines.map((line, idx) => (
                  <div key={idx} style={{ color: COLORS.textDim, padding: '1px 4px' }}>
                    {line || '\u00A0'}
                  </div>
                ))
            }
          </div>
        </div>

        {/* Right — Optimized */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: COLORS.accent,
            padding: '8px 12px',
            background: COLORS.accentDim, borderRadius: '8px 8px 0 0',
            border: `1px solid ${COLORS.accent}`, borderBottom: 'none',
          }}>
            {isES ? 'CV Optimizado' : 'Optimized CV'}
          </div>
          <div
            ref={rightRef}
            onScroll={() => handleScroll('right')}
            style={{ ...panelStyle, borderColor: COLORS.accent }}
            aria-label={isES ? 'CV Optimizado' : 'Optimized CV'}
          >
            {viewMode === 'diff'
              ? diffResult.map((entry, idx) => {
                  if (entry.type === 'removed') {
                    return (
                      <div key={idx} style={{ height: '1.7em', color: COLORS.textMuted, opacity: 0.3 }}>
                        {'\u00A0'}
                      </div>
                    );
                  }
                  const colors = DIFF_COLORS[entry.type];
                  return (
                    <div key={idx} style={{
                      background: colors.bg,
                      color: colors.color,
                      padding: '1px 4px',
                      borderRadius: 2,
                      borderLeft: entry.type !== 'unchanged' ? `3px solid ${colors.border}` : '3px solid transparent',
                    }}>
                      {entry.optimized || '\u00A0'}
                    </div>
                  );
                })
              : optimizedLines.map((line, idx) => (
                  <div key={idx} style={{ color: COLORS.text, padding: '1px 4px' }}>
                    {line || '\u00A0'}
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
