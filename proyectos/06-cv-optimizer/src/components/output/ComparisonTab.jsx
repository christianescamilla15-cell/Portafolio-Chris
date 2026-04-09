import React from 'react';
import { COLORS } from '../../constants/colors.js';

export default function ComparisonTab({ results, cvText, isES }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 14, color: COLORS.textDim }}>
        {isES ? 'Comparaci\u00f3n lado a lado de tu CV original vs. el optimizado' : 'Side-by-side comparison of your original CV vs. optimized'}
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Original */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: COLORS.textDim,
            marginBottom: 8, padding: '8px 12px',
            background: COLORS.bgCard, borderRadius: '8px 8px 0 0',
            border: `1px solid ${COLORS.border}`, borderBottom: 'none',
          }}>
            {isES ? 'CV Original' : 'Original CV'}
          </div>
          <div style={{
            background: COLORS.bgInput,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '0 0 8px 8px',
            padding: 16,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 600,
            overflowY: 'auto',
            color: COLORS.textDim,
          }}>
            {cvText}
          </div>
        </div>
        {/* Optimized */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: COLORS.accent,
            marginBottom: 8, padding: '8px 12px',
            background: COLORS.accentDim, borderRadius: '8px 8px 0 0',
            border: `1px solid ${COLORS.accent}`, borderBottom: 'none',
          }}>
            {isES ? 'CV Optimizado' : 'Optimized CV'}
          </div>
          <div style={{
            background: COLORS.bgInput,
            border: `1px solid ${COLORS.accent}`,
            borderRadius: '0 0 8px 8px',
            padding: 16,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 600,
            overflowY: 'auto',
          }}>
            {results.optimizedCV.text.split('\n').map((line, idx) => {
              const changedSections = results.optimizedCV.changes.map(c => c.section);
              let bg = 'transparent';
              let color = COLORS.text;
              const trimmedLine = line.trim();
              const isSeparator = trimmedLine === '---' || trimmedLine === '';
              if (!isSeparator && trimmedLine.length > 0) {
                if (changedSections.includes('profile') && (
                  /^(PERFIL PROFESIONAL|PROFESSIONAL PROFILE)$/i.test(trimmedLine) ||
                  (idx > 0 && /Competencias clave|Key competencies/i.test(line))
                )) {
                  bg = COLORS.yellowBg;
                  color = COLORS.yellow;
                }
                if (changedSections.includes('skills') && results.optimizedCV.addedSkills.some(s => line.toLowerCase().includes(s.toLowerCase()))) {
                  bg = COLORS.greenBg;
                  color = COLORS.green;
                }
              }
              return (
                <div key={idx} style={{ background: bg, color, padding: '1px 4px', borderRadius: 2 }}>
                  {line || '\u00A0'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
