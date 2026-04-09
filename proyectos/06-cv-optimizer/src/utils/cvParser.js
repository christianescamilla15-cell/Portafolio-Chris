// ─────────────────────────────────────────────
// CV PARSER — Extracts structured data from CV text
// ─────────────────────────────────────────────
const SECTION_PATTERNS = {
  profile: /^(perfil\s*profesional|perfil|resumen\s*profesional|resumen|summary|professional\s*summary|professional\s*profile|profile|about\s*me|about|acerca|objetivo|objective)\s*:?\s*$/i,
  experience: /^(experiencia\s*laboral|experiencia\s*profesional|experiencia|experience|work\s*experience|professional\s*experience|employment|empleo|historial\s*laboral|historial)\s*:?\s*$/i,
  projects: /^(proyectos|projects|personal\s*projects|proyectos\s*personales|proyectos\s*destacados|key\s*projects)\s*:?\s*$/i,
  education: /^(educaci[o\u00f3]n|formaci[o\u00f3]n\s*acad[e\u00e9]mica|formaci[o\u00f3]n|education|academic\s*background|studies|estudios)\s*:?\s*$/i,
  skills: /^(habilidades\s*t[e\u00e9]cnicas|habilidades|skills|technical\s*skills|competencias\s*t[e\u00e9]cnicas|competencias|technologies|tecnolog[\u00edi]as|tools|herramientas|tech\s*stack)\s*:?\s*$/i,
  languages: /^(idiomas|languages)\s*:?\s*$/i,
  certifications: /^(certificaciones|certifications|courses|cursos|certificates)\s*:?\s*$/i,
  competencies: /^(competencias\s*clave|key\s*competencies|soft\s*skills|habilidades\s*blandas)\s*:?\s*$/i,
};

export function parseCV(text) {
  // Pre-process: insert line breaks before known section headers in unstructured text
  const sectionNames = [
    'perfil profesional', 'professional profile', 'profile', 'perfil',
    'resumen profesional', 'professional summary', 'summary', 'about me',
    'experiencia laboral', 'experiencia profesional', 'experiencia',
    'work experience', 'professional experience', 'experience', 'employment',
    'proyectos relevantes', 'proyectos destacados', 'proyectos personales',
    'proyectos', 'projects', 'personal projects', 'key projects',
    'habilidades t\u00e9cnicas', 'habilidades', 'technical skills', 'skills',
    'competencias t\u00e9cnicas', 'competencias', 'technologies', 'tech stack',
    'herramientas', 'tools',
    'educaci\u00f3n', 'formaci\u00f3n acad\u00e9mica', 'formaci\u00f3n', 'education',
    'academic background', 'studies', 'estudios',
    'idiomas', 'languages',
    'certificaciones', 'certifications', 'courses', 'cursos',
    'competencias clave', 'key competencies', 'soft skills', 'habilidades blandas',
  ];

  let processed = text;
  for (const name of sectionNames) {
    const regex = new RegExp(`([.!?\\s])\\s*(${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
    processed = processed.replace(regex, '$1\n\n$2');
  }

  const lines = processed.split('\n');
  const result = {
    name: '',
    title: '',
    contact: { phone: '', email: '', location: '', portfolio: '', github: '', linkedin: '' },
    profile: '',
    experience: [],
    projects: [],
    skills: {},
    education: [],
    languages: '',
    competencies: [],
    rawSections: {},
  };

  // Pass 1: Extract name, title, contact from the header (before first section)
  let firstSectionIdx = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    for (const pattern of Object.values(SECTION_PATTERNS)) {
      if (pattern.test(trimmed)) {
        firstSectionIdx = i;
        break;
      }
    }
    if (firstSectionIdx < lines.length) break;
  }

  const headerLines = lines.slice(0, firstSectionIdx).map(l => l.trim()).filter(l => l.length > 0);

  // Extract contact info from header lines
  const emailRegex = /[\w.+-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+?\d[\d\s\-().]{7,15}\d)/;
  const githubRegex = /github\.com\/[\w\-]+/i;
  const linkedinRegex = /linkedin\.com\/in\/[\w\-]+/i;
  const portfolioRegex = /(portfolio|portafolio|[\w\-]+\.(com|io|dev|me|net|org))/i;

  const contactLines = [];
  const nonContactHeaderLines = [];

  for (const hl of headerLines) {
    const hasEmail = emailRegex.test(hl);
    const hasPhone = phoneRegex.test(hl);
    const hasUrl = /(?:https?:\/\/[^\s,|]+|(?:www\.)[^\s,|]+)/gi.test(hl);
    const hasPipe = hl.includes('|') && (hasEmail || hasPhone || hasUrl || hl.split('|').length >= 3);

    if (hasEmail || hasPhone || (hasPipe && hl.length < 200)) {
      contactLines.push(hl);
    } else {
      nonContactHeaderLines.push(hl);
    }
  }

  // Name = first non-contact header line
  if (nonContactHeaderLines.length > 0) {
    result.name = nonContactHeaderLines[0];
  }
  // Title = second non-contact header line (if it looks like a title)
  if (nonContactHeaderLines.length > 1) {
    const candidate = nonContactHeaderLines[1];
    if (candidate.length < 120) {
      result.title = candidate;
    }
  }

  // Parse contact info
  const allContactText = contactLines.join(' | ');
  const emailMatch = allContactText.match(emailRegex);
  if (emailMatch) result.contact.email = emailMatch[0];

  const phoneMatch = allContactText.match(phoneRegex);
  if (phoneMatch) result.contact.phone = phoneMatch[1].trim();

  // URLs
  const urls = allContactText.match(/(?:https?:\/\/)?(?:www\.)?[^\s,|]+\.[^\s,|]+/gi) || [];
  for (const u of urls) {
    if (githubRegex.test(u)) result.contact.github = u;
    else if (linkedinRegex.test(u)) result.contact.linkedin = u;
    else if (!emailRegex.test(u) && portfolioRegex.test(u) && !result.contact.portfolio) result.contact.portfolio = u;
  }

  // Location: anything in contactLines that's not email/phone/url, often a city name
  const contactParts = allContactText.split(/[|\u00b7\u2022,]/).map(p => p.trim());
  for (const part of contactParts) {
    if (!part) continue;
    if (emailRegex.test(part) || phoneRegex.test(part) || /https?:\/\//.test(part) || githubRegex.test(part) || linkedinRegex.test(part)) continue;
    if (/(ciudad|cdmx|mexico|m[e\u00e9]xico|remote|remoto|san\s|new\s|los\s|bogot|lima|buenos|madrid|barcelona|london|berlin|[A-Z][a-z]+,\s*[A-Z]{2})/i.test(part)) {
      result.contact.location = part;
      break;
    }
  }
  // Fallback: check non-contact header lines for location patterns
  if (!result.contact.location) {
    for (const hl of nonContactHeaderLines.slice(1)) {
      if (/(ciudad|cdmx|mexico|m[e\u00e9]xico|remote|remoto|[A-Z][a-z]+,\s*[A-Z]{2})/i.test(hl) && hl.length < 60) {
        result.contact.location = hl;
        break;
      }
    }
  }

  // Pass 2: Split into sections
  let currentSection = null;
  let currentContent = [];
  const sections = [];

  for (let i = firstSectionIdx; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    let foundSection = null;
    for (const [sectionName, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(trimmed)) {
        foundSection = sectionName;
        break;
      }
    }
    if (foundSection) {
      if (currentSection) {
        sections.push({ name: currentSection, lines: currentContent });
      }
      currentSection = foundSection;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(lines[i]);
    }
  }
  if (currentSection) {
    sections.push({ name: currentSection, lines: currentContent });
  }

  // Pass 3: Parse each section
  for (const section of sections) {
    const contentLines = section.lines.map(l => l.trim()).filter(l => l.length > 0);
    result.rawSections[section.name] = contentLines.join('\n');

    switch (section.name) {
      case 'profile': {
        result.profile = contentLines.join(' ');
        break;
      }
      case 'experience': {
        const entries = [];
        let currentEntry = null;

        for (const cl of contentLines) {
          const isBullet = /^[-\u2022*]\s/.test(cl);
          if (!isBullet) {
            const dateMatch = cl.match(/\(?\s*(\d{4})\s*[-\u2013\u2014]\s*(present|actual|actualidad|\d{4})\s*\)?/i) ||
                              cl.match(/\|?\s*([A-Z][a-z]{2,8}\s+\d{4})\s*[-\u2013\u2014]\s*(Present|Actual|Actualidad|[A-Z][a-z]{2,8}\s+\d{4})/i);
            if (dateMatch || (/[-\u2013\u2014|]/.test(cl) && cl.length < 120 && !cl.startsWith('[')) ) {
              if (currentEntry) entries.push(currentEntry);
              let role = '', company = '', period = '';
              if (dateMatch) {
                period = dateMatch[0].replace(/^\|?\s*/, '').replace(/[()]/g, '').trim();
                const beforeDate = cl.substring(0, cl.indexOf(dateMatch[0])).trim().replace(/\|?\s*$/, '').trim();
                const parts = beforeDate.split(/\s*[-\u2013\u2014]\s*|\s*\|\s*/);
                if (parts.length >= 2) {
                  role = parts[0].trim();
                  company = parts.slice(1).join(' \u2014 ').trim();
                } else {
                  role = beforeDate;
                }
              } else {
                const parts = cl.split(/\s*[-\u2013\u2014]\s*|\s*\|\s*/);
                if (parts.length >= 2) {
                  role = parts[0].trim();
                  company = parts.slice(1).join(' \u2014 ').trim();
                } else {
                  role = cl;
                }
              }
              currentEntry = { role, company, period, bullets: [] };
            } else if (currentEntry) {
              if (cl.length > 20) {
                currentEntry.bullets.push(cl);
              }
            } else {
              currentEntry = { role: cl, company: '', period: '', bullets: [] };
            }
          } else if (currentEntry) {
            currentEntry.bullets.push(cl.replace(/^[-\u2022*]\s*/, ''));
          } else {
            currentEntry = { role: '', company: '', period: '', bullets: [cl.replace(/^[-\u2022*]\s*/, '')] };
          }
        }
        if (currentEntry) entries.push(currentEntry);
        result.experience = entries;
        break;
      }
      case 'projects': {
        const entries = [];
        let currentEntry = null;
        for (const cl of contentLines) {
          const isBullet = /^[-\u2022*]\s/.test(cl);
          if (!isBullet && cl.length < 120) {
            if (currentEntry) entries.push(currentEntry);
            const parts = cl.split(/\s*[-\u2013\u2014|]\s*/);
            currentEntry = {
              name: parts[0]?.trim() || cl,
              stack: parts.length > 1 ? parts.slice(1).join(' | ').trim() : '',
              bullets: [],
              demo: '',
            };
            const urlMatch = cl.match(/(https?:\/\/[^\s,|]+)/);
            if (urlMatch) currentEntry.demo = urlMatch[1];
          } else if (currentEntry) {
            const bulletText = cl.replace(/^[-\u2022*]\s*/, '');
            const urlMatch = bulletText.match(/(https?:\/\/[^\s,|]+)/);
            if (urlMatch && !currentEntry.demo) currentEntry.demo = urlMatch[1];
            currentEntry.bullets.push(bulletText);
          }
        }
        if (currentEntry) entries.push(currentEntry);
        result.projects = entries;
        break;
      }
      case 'skills': {
        const flatSkills = [];
        for (const cl of contentLines) {
          const categoryMatch = cl.match(/^(.+?):\s*(.+)$/);
          if (categoryMatch) {
            const cat = categoryMatch[1].trim();
            const skills = categoryMatch[2].split(/[,|\u2022\u00b7]/).map(s => s.trim()).filter(s => s);
            result.skills[cat] = skills;
          } else {
            const skills = cl.split(/[,|\u2022\u00b7\/]/).map(s => s.trim()).filter(s => s.length > 0);
            flatSkills.push(...skills);
          }
        }
        if (flatSkills.length > 0 && Object.keys(result.skills).length === 0) {
          result.skills['General'] = flatSkills;
        } else if (flatSkills.length > 0) {
          result.skills['Otros'] = flatSkills;
        }
        break;
      }
      case 'education': {
        const entries = [];
        for (const cl of contentLines) {
          const dateMatch = cl.match(/\(?\s*(\d{4})\s*[-\u2013\u2014]\s*(\d{4}|present|actual|actualidad)\s*\)?/i);
          let period = '', institution = '', program = '';
          if (dateMatch) {
            period = dateMatch[0].replace(/[()]/g, '').trim();
            const beforeDate = cl.substring(0, cl.indexOf(dateMatch[0])).trim().replace(/[-\u2013\u2014|,]\s*$/, '').trim();
            const parts = beforeDate.split(/\s*[-\u2013\u2014]\s*|\s*[,]\s*/);
            if (parts.length >= 2) {
              program = parts[0].trim();
              institution = parts.slice(1).join(', ').trim();
            } else {
              program = beforeDate;
            }
          } else {
            const parts = cl.split(/\s*[-\u2013\u2014]\s*|\s*[|]\s*/);
            program = parts[0]?.trim() || cl;
            institution = parts.length > 1 ? parts.slice(1).join(' - ').trim() : '';
          }
          if (program || institution) {
            entries.push({ period, institution, program });
          }
        }
        result.education = entries;
        break;
      }
      case 'languages': {
        result.languages = contentLines.join(', ');
        break;
      }
      case 'competencies': {
        result.competencies = [];
        for (const cl of contentLines) {
          const items = cl.split(/[,|\u2022\u00b7]/).map(s => s.trim()).filter(s => s);
          result.competencies.push(...items);
        }
        break;
      }
      case 'certifications': {
        result.rawSections.certifications = contentLines.join('\n');
        break;
      }
      default:
        break;
    }
  }

  return result;
}
