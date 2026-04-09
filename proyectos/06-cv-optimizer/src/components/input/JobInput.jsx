import React from 'react';
import { COLORS } from '../../constants/colors.js';

export default function JobInput({ jobText, setJobText, isES, validationError }) {
  const jobInputId = 'job-text-input';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 200 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <label htmlFor={jobInputId} style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>
          {isES ? 'Descripcion de la Vacante' : 'Job Description'}
        </label>
        {jobText.length > 0 && (
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>
            {jobText.length} chars
          </span>
        )}
      </div>
      <textarea
        id={jobInputId}
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        placeholder={isES ? 'Pega la descripcion de la vacante...' : 'Paste the job description...'}
        aria-required="true"
        aria-invalid={!!validationError}
        aria-describedby={validationError ? 'job-validation-error' : undefined}
        style={{
          flex: 1,
          minHeight: 200,
          background: COLORS.bgInput,
          color: COLORS.text,
          border: `1px solid ${validationError ? COLORS.red : COLORS.border}`,
          borderRadius: 16,
          padding: 16,
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          lineHeight: 1.6,
          resize: 'vertical',
          transition: 'border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onFocus={e => { if (!validationError) { e.target.style.borderColor = 'rgba(139,92,246,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)'; } }}
        onBlur={e => { e.target.style.borderColor = validationError ? COLORS.red : COLORS.border; e.target.style.boxShadow = 'none'; }}
      />
      {validationError && (
        <div
          id="job-validation-error"
          role="alert"
          style={{
            fontSize: 12,
            color: COLORS.red,
            marginTop: 4,
            fontFamily: 'DM Sans',
          }}
        >
          {validationError}
        </div>
      )}
    </div>
  );
}
