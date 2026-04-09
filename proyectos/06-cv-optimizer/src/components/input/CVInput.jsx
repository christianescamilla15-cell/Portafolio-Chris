import React, { useRef, useState, useCallback } from 'react';
import { COLORS } from '../../constants/colors.js';

const MAX_CV_LENGTH = 50000;

export default function CVInput({ cvText, setCvText, isES, validationError }) {
  const fileInputRef = useRef(null);
  const [fileLoading, setFileLoading] = useState(false);

  const handleTextChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_CV_LENGTH) {
      setCvText(value);
    }
  }, [setCvText]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    setFileLoading(true);

    try {
      if (ext === 'pdf') {
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) { alert('Error cargando lector de PDF. Recarga la p\u00e1gina.'); return; }
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          let lastY = null;
          for (const item of content.items) {
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
              text += '\n';
            }
            text += item.str + ' ';
            lastY = item.transform[5];
          }
          text += '\n\n';
        }
        setCvText(text.trim().slice(0, MAX_CV_LENGTH));
      } else if (ext === 'docx' || ext === 'doc') {
        const mammoth = window.mammoth;
        if (!mammoth) { alert('Error cargando lector de DOCX. Recarga la p\u00e1gina.'); return; }
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setCvText(result.value.trim().slice(0, MAX_CV_LENGTH));
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => setCvText(ev.target.result.slice(0, MAX_CV_LENGTH));
        reader.readAsText(file);
      }
    } catch (err) {
      alert('Error al leer el archivo. Intenta con otro formato o pega el texto manualmente.');
      console.error(err);
    } finally {
      setFileLoading(false);
      e.target.value = '';
    }
  }, [setCvText]);

  const cvInputId = 'cv-text-input';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 200 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <label htmlFor={cvInputId} style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>
          {isES ? 'Tu CV' : 'Your CV'}
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.text,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            aria-label={isES ? 'Subir archivo de CV' : 'Upload CV file'}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label={isES ? 'Subir archivo de CV (.pdf, .docx, .txt)' : 'Upload CV file (.pdf, .docx, .txt)'}
            disabled={fileLoading}
            style={{
              padding: '4px 12px',
              background: COLORS.bgInput,
              color: COLORS.textDim,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              cursor: fileLoading ? 'wait' : 'pointer',
              fontFamily: 'DM Sans',
              fontSize: 12,
              backdropFilter: 'blur(12px)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {fileLoading ? (isES ? 'Leyendo...' : 'Reading...') : (isES ? 'Subir archivo' : 'Upload file')} (.pdf, .docx, .txt)
          </button>
          {cvText.length > 0 && (
            <span style={{ fontSize: 12, color: COLORS.textMuted, alignSelf: 'center' }}>
              {cvText.length} / {MAX_CV_LENGTH.toLocaleString()} chars
            </span>
          )}
        </div>
      </div>
      <textarea
        id={cvInputId}
        value={cvText}
        onChange={handleTextChange}
        placeholder={isES ? 'Pega tu CV aqu\u00ed...' : 'Paste your CV here...'}
        maxLength={MAX_CV_LENGTH}
        aria-required="true"
        aria-invalid={!!validationError}
        aria-describedby={validationError ? 'cv-validation-error' : undefined}
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
          id="cv-validation-error"
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
