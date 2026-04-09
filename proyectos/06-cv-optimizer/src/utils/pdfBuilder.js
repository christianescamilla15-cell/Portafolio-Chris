export function buildPDFHtml(data, lang, format) {
  const isATS = format === 'ats';
  const fontFamily = "'Calibri', 'Helvetica Neue', Arial, sans-serif";
  const headerColor = isATS ? '#333' : '#2D3748';
  const borderStyle = isATS ? '1.5px solid #333' : '2px solid #4F46E5';
  const sectionBorder = isATS ? '1px solid #ccc' : '1px solid #CBD5E0';

  const isEN = lang === 'en';
  const labels = {
    profile: isEN ? 'PROFESSIONAL PROFILE' : 'PERFIL PROFESIONAL',
    experience: isEN ? 'EXPERIENCE' : 'EXPERIENCIA',
    projects: isEN ? 'PROJECTS' : 'PROYECTOS',
    skills: isEN ? 'TECHNICAL SKILLS' : 'HABILIDADES T\u00c9CNICAS',
    education: isEN ? 'EDUCATION' : 'EDUCACI\u00d3N',
    languages: isEN ? 'LANGUAGES' : 'IDIOMAS',
    competencies: isEN ? 'KEY COMPETENCIES' : 'COMPETENCIAS CLAVE',
  };

  const esc = (t) => (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let html = `<div style="font-family: ${fontFamily}; color: #333; max-width: 100%; font-size: 11pt; line-height: 1.4;">`;

  // Name
  html += `<h1 style="font-size: 20pt; font-weight: 700; color: #111; margin: 0 0 2px; border: none; padding: 0;">${esc(data.name)}</h1>`;

  // Title
  if (data.title) {
    html += `<div style="font-size: 11pt; color: #555; margin: 0 0 4px;">${esc(data.title)}</div>`;
  }

  // Contact line
  const contactParts = [data.contact.phone, data.contact.email, data.contact.location, data.contact.portfolio, data.contact.github, data.contact.linkedin].filter(Boolean);
  if (contactParts.length > 0) {
    html += `<div style="font-size: 9pt; color: #666; margin: 0 0 12px;">${contactParts.map(esc).join(' | ')}</div>`;
  }

  // Main separator
  html += `<hr style="border: none; border-top: ${borderStyle}; margin: 0 0 12px;" />`;

  // Section header helper
  const sectionH2 = (title) => `<h2 style="font-size: 11pt; font-weight: 700; color: ${headerColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: ${sectionBorder}; padding-bottom: 3px; margin: 14px 0 8px;">${esc(title)}</h2>`;

  // Profile
  if (data.profile) {
    html += sectionH2(labels.profile);
    html += `<p style="font-size: 10pt; margin: 0 0 12px; line-height: 1.5;">${esc(data.profile)}</p>`;
  }

  // Experience
  if (data.experience.length > 0) {
    html += sectionH2(labels.experience);
    data.experience.forEach((exp) => {
      html += '<div style="margin-bottom: 10px;">';
      const roleCompany = [exp.role, exp.company].filter(Boolean).join(' \u2014 ');
      html += '<div style="display: flex; justify-content: space-between; align-items: baseline;">';
      html += `<strong style="font-size: 10.5pt;">${esc(roleCompany)}</strong>`;
      if (exp.period) {
        html += `<span style="font-size: 9.5pt; color: #666; white-space: nowrap; margin-left: 12px;">${esc(exp.period)}</span>`;
      }
      html += '</div>';
      if (exp.bullets.length > 0) {
        html += '<ul style="margin: 4px 0 0 16px; padding: 0; font-size: 10pt; line-height: 1.5;">';
        exp.bullets.forEach((b) => {
          html += `<li style="margin-bottom: 2px;">${esc(b)}</li>`;
        });
        html += '</ul>';
      }
      html += '</div>';
    });
  }

  // Projects
  if (data.projects.length > 0) {
    html += sectionH2(labels.projects);
    data.projects.forEach((proj) => {
      html += '<div style="margin-bottom: 10px;">';
      const projHeader = [proj.name, proj.stack].filter(Boolean).join(' \u2014 ');
      html += `<strong style="font-size: 10.5pt;">${esc(projHeader)}</strong>`;
      if (proj.bullets.length > 0) {
        html += '<ul style="margin: 4px 0 0 16px; padding: 0; font-size: 10pt; line-height: 1.5;">';
        proj.bullets.forEach((b) => {
          html += `<li style="margin-bottom: 2px;">${esc(b)}</li>`;
        });
        html += '</ul>';
      }
      if (proj.demo) {
        html += `<div style="font-size: 9pt; color: #666; margin-top: 2px;">Demo: ${esc(proj.demo)}</div>`;
      }
      html += '</div>';
    });
  }

  // Skills
  if (Object.keys(data.skills).length > 0) {
    html += sectionH2(labels.skills);
    const skillEntries = Object.entries(data.skills);
    if (skillEntries.length === 1 && (skillEntries[0][0] === 'General' || skillEntries[0][0] === 'Tecnolog\u00edas' || skillEntries[0][0] === 'Technologies')) {
      html += `<p style="font-size: 10pt; margin: 0 0 8px; line-height: 1.6;">${skillEntries[0][1].map(esc).join(' | ')}</p>`;
    } else {
      html += '<table style="width: 100%; font-size: 10pt; border-collapse: collapse; margin-bottom: 8px;">';
      skillEntries.forEach(([cat, skills]) => {
        html += '<tr>';
        html += `<td style="font-weight: 600; vertical-align: top; padding: 3px 12px 3px 0; white-space: nowrap; width: 1%;">${esc(cat)}</td>`;
        html += `<td style="padding: 3px 0; color: #444;">${skills.map(esc).join(', ')}</td>`;
        html += '</tr>';
      });
      html += '</table>';
    }
  }

  // Education
  if (data.education.length > 0) {
    html += sectionH2(labels.education);
    html += '<table style="width: 100%; font-size: 10pt; border-collapse: collapse; margin-bottom: 8px;">';
    data.education.forEach((edu) => {
      html += '<tr>';
      if (edu.period) {
        html += `<td style="padding: 3px 12px 3px 0; white-space: nowrap; color: #666; width: 1%;">${esc(edu.period)}</td>`;
      }
      html += `<td style="padding: 3px 0;"><strong>${esc(edu.program)}</strong>${edu.institution ? ' \u2014 ' + esc(edu.institution) : ''}</td>`;
      html += '</tr>';
    });
    html += '</table>';
  }

  // Languages
  if (data.languages) {
    html += sectionH2(labels.languages);
    html += `<p style="font-size: 10pt; margin: 0 0 8px;">${esc(data.languages)}</p>`;
  }

  // Competencies
  if (data.competencies.length > 0) {
    html += sectionH2(labels.competencies);
    html += `<p style="font-size: 10pt; margin: 0 0 8px;">${data.competencies.map(esc).join(' | ')}</p>`;
  }

  html += '</div>';
  return html;
}
