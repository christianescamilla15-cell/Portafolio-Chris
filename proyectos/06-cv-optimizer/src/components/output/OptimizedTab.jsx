import React, { useState, useCallback } from 'react';
import { COLORS } from '../../constants/colors.js';
import Card from '../common/Card.jsx';
import { buildPDFHtml } from '../../utils/pdfBuilder.js';
import { parseCV } from '../../utils/cvParser.js';
import { areSynonyms } from '../../utils/synonyms.js';
import { translateStructured } from '../../constants/translations.js';

export default function OptimizedTab({ results, language, cvText, isES }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!results) return;
    navigator.clipboard.writeText(results.optimizedCV.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [results]);

  const handleDownloadPDF = useCallback((lang, format) => {
    if (!results) return;
    const structured = results.optimizedCV.structured;
    const isOriginal = format === 'original';

    let data;
    if (isOriginal) {
      const originalParsed = parseCV(cvText);
      const addedSkills = results.optimizedCV.addedSkills || [];
      const origSkills = { ...originalParsed.skills };
      const allOrigSkillValues = Object.values(origSkills).flat();
      const toAdd = addedSkills.filter(s => !allOrigSkillValues.some(os => areSynonyms(os, s)));
      if (toAdd.length > 0) {
        const firstKey = Object.keys(origSkills)[0];
        if (firstKey) {
          origSkills[firstKey] = [...origSkills[firstKey], ...toAdd];
        } else {
          origSkills[language === 'es' ? 'Habilidades' : 'Skills'] = toAdd;
        }
      }
      data = {
        name: originalParsed.name,
        title: originalParsed.title,
        contact: originalParsed.contact,
        profile: originalParsed.profile || structured.profile,
        experience: originalParsed.experience,
        projects: originalParsed.projects,
        skills: origSkills,
        education: originalParsed.education,
        languages: originalParsed.languages,
        competencies: originalParsed.competencies,
      };
    } else {
      data = structured;
    }

    // Translate if needed
    if (lang !== language) {
      data = translateStructured(data, lang);
    }

    const html = buildPDFHtml(data, lang, format === 'original' ? 'ats' : format);

    // Generate PDF
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.width = '210mm';
    container.style.padding = '15mm';
    container.style.background = '#fff';
    document.body.appendChild(container);

    const isATSFormat = format === 'ats';
    const opt = {
      margin: 0,
      filename: lang === 'es'
        ? (isATSFormat ? 'CV-Optimizado-ATS.pdf' : (isOriginal ? 'CV-Formato-Original.pdf' : 'CV-Optimizado.pdf'))
        : (isATSFormat ? 'Optimized-CV-ATS.pdf' : (isOriginal ? 'CV-Original-Format.pdf' : 'Optimized-CV.pdf')),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    window.html2pdf().set(opt).from(container).save().then(() => {
      document.body.removeChild(container);
    }).catch(() => {
      document.body.removeChild(container);
      // Fallback to txt
      const blob = new Blob([results.optimizedCV.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv-optimizado.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [results, language, cvText]);

  const previewHtml = buildPDFHtml(results.optimizedCV.structured, language, 'ats');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Download options */}
      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textLight, marginBottom: 12 }}>
          {isES ? 'Descargar CV Optimizado' : 'Download Optimized CV'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleCopy} aria-label={isES ? 'Copiar CV optimizado al portapapeles' : 'Copy optimized CV to clipboard'} style={{
            padding: '8px 16px', background: copied ? COLORS.green : COLORS.accent,
            color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12, transition: 'all 0.2s',
          }}>
            {copied ? (isES ? 'Copiado!' : 'Copied!') : (isES ? 'Copiar texto' : 'Copy text')}
          </button>
          <button onClick={() => handleDownloadPDF('es', 'ats')} aria-label="Descargar PDF en espanol formato ATS" style={{
            padding: '8px 16px', background: 'transparent', color: COLORS.accent,
            border: `1px solid ${COLORS.accent}`, borderRadius: 8, cursor: 'pointer',
            fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12,
          }}>
            PDF Espa\u00f1ol (ATS)
          </button>
          <button onClick={() => handleDownloadPDF('en', 'ats')} aria-label="Download PDF in English ATS format" style={{
            padding: '8px 16px', background: 'transparent', color: COLORS.accent,
            border: `1px solid ${COLORS.accent}`, borderRadius: 8, cursor: 'pointer',
            fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12,
          }}>
            PDF English (ATS)
          </button>
        </div>
        <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 8, lineHeight: 1.5 }}>
          {isES
            ? 'ATS = Formato optimizado para sistemas de seguimiento de candidatos. Sin columnas, sin gr\u00e1ficos, tipograf\u00eda limpia.'
            : 'ATS = Format optimized for Applicant Tracking Systems. No columns, no graphics, clean typography.'}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: COLORS.textDim }}>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}`, borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} /> {isES ? 'Agregado' : 'Added'}</span>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: COLORS.yellowBg, border: `1px solid ${COLORS.yellowBorder}`, borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} /> {isES ? 'Modificado' : 'Modified'}</span>
      </div>

      {/* HTML Preview */}
      <div style={{
        background: '#fff',
        borderRadius: 10,
        padding: '32px 36px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
        maxWidth: 720,
        margin: '0 auto',
      }}>
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>

      {/* Added skills note */}
      {results.optimizedCV.addedSkills.length > 0 && (
        <Card color={COLORS.accent} borderColor={COLORS.accent} bgColor={COLORS.accentDim}
          title={isES ? 'Habilidades sugeridas' : 'Suggested skills'}
        >
          {isES
            ? `Se agregaron estas habilidades de la vacante que podr\u00edas tener: ${results.optimizedCV.addedSkills.join(', ')}. Revisa y elimina las que no apliquen.`
            : `These skills from the job posting were added as suggestions: ${results.optimizedCV.addedSkills.join(', ')}. Review and remove any that don't apply.`}
        </Card>
      )}
    </div>
  );
}
