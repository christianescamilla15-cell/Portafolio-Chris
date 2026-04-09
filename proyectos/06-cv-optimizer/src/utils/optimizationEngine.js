import { areSynonyms, findSynonymGroup } from './synonyms.js';
import { parseCV } from './cvParser.js';
import { extractSkillsFromRawText, extractExperienceFromRawText, extractEducationFromRawText } from './skillExtractor.js';

export function generateOptimizedCV(cvText, jobText, jobKeywords, strengths, weaknesses, language) {
  const isES = language === 'es';
  const parsed = parseCV(cvText);
  const missingSkills = weaknesses.filter((w) => w.type === 'skill').map((w) => w.keyword);
  const matchedSkills = strengths.filter((s) => s.type === 'skill').map((s) => s.keyword);
  const topSkills = [...matchedSkills, ...missingSkills.slice(0, 5)].slice(0, 10);
  const changes = [];

  // If parser returned sparse data, supplement from raw text
  let experienceData = parsed.experience.length > 0
    ? parsed.experience
    : extractExperienceFromRawText(cvText);
  let educationData = parsed.education.length > 0
    ? parsed.education
    : extractEducationFromRawText(cvText);
  let skillsFromRaw = Object.keys(parsed.skills).length > 0
    ? []
    : extractSkillsFromRawText(cvText);

  // Extract name from raw text if parser missed it
  let nameFromText = parsed.name;
  if (!nameFromText) {
    const firstLines = cvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    for (const line of firstLines.slice(0, 5)) {
      if (/^[A-Z\u00c1\u00c9\u00cd\u00d3\u00da\u00d1][a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1]+(\s+[A-Z\u00c1\u00c9\u00cd\u00d3\u00da\u00d1][a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1]+){1,4}$/.test(line) && line.length < 60) {
        nameFromText = line;
        break;
      }
    }
  }

  // Build structured output
  const structured = {
    name: nameFromText || (isES ? 'Tu Nombre' : 'Your Name'),
    title: parsed.title || '',
    contact: { ...parsed.contact },
    profile: '',
    experience: experienceData.map(e => ({ ...e, bullets: [...(e.bullets || [])] })),
    projects: parsed.projects.map(p => ({ ...p, bullets: [...p.bullets] })),
    skills: {},
    education: educationData.map(e => ({ ...e })),
    languages: parsed.languages,
    competencies: [...parsed.competencies],
  };

  // Optimize profile: inject top keywords
  if (parsed.profile) {
    const keywordsPhrase = topSkills.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    if (isES) {
      structured.profile = `${parsed.profile} Competencias clave: ${keywordsPhrase}.`;
    } else {
      structured.profile = `${parsed.profile} Key competencies: ${keywordsPhrase}.`;
    }
    changes.push({ section: 'profile', type: 'modified' });
  } else {
    const keywordsPhrase = topSkills.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    if (isES) {
      structured.profile = `Profesional con experiencia en ${keywordsPhrase}. Orientado a resultados con capacidad de adaptaci\u00f3n a nuevas tecnolog\u00edas y metodolog\u00edas.`;
    } else {
      structured.profile = `Professional with experience in ${keywordsPhrase}. Results-oriented with ability to adapt to new technologies and methodologies.`;
    }
    changes.push({ section: 'profile', type: 'added' });
  }

  // Optimize skills: reorder with matched first, add missing
  const allSkillValues = [...Object.values(parsed.skills).flat(), ...skillsFromRaw];
  const orderedSkills = [];
  matchedSkills.forEach((s) => {
    const cap = s.charAt(0).toUpperCase() + s.slice(1);
    if (!orderedSkills.some((os) => areSynonyms(os, s))) {
      orderedSkills.push(cap);
    }
  });
  allSkillValues.forEach((s) => {
    if (!orderedSkills.some((os) => areSynonyms(os, s))) {
      orderedSkills.push(s);
    }
  });
  const addedSkillsList = [];
  missingSkills.slice(0, 5).forEach((ms) => {
    const cap = ms.charAt(0).toUpperCase() + ms.slice(1);
    if (!orderedSkills.some((os) => areSynonyms(os, ms))) {
      orderedSkills.push(cap);
      addedSkillsList.push(cap);
    }
  });

  // Group skills into categories
  if (Object.keys(parsed.skills).length > 1 && !parsed.skills['General'] && skillsFromRaw.length === 0) {
    structured.skills = { ...parsed.skills };
    if (addedSkillsList.length > 0) {
      const suggestedKey = isES ? 'Adicionales (de la vacante)' : 'Additional (from job posting)';
      structured.skills[suggestedKey] = addedSkillsList;
    }
  } else {
    structured.skills[isES ? 'Tecnolog\u00edas' : 'Technologies'] = orderedSkills;
  }
  if (addedSkillsList.length > 0) {
    changes.push({ section: 'skills', type: 'modified' });
  }

  // Add competencies if missing
  if (structured.competencies.length === 0) {
    const softSkillKeywords = missingSkills.filter(ms => {
      const group = findSynonymGroup(ms);
      if (!group) return false;
      return group.some(t => /(leadership|teamwork|communication|problem solving|agile|project management|liderazgo|trabajo en equipo|comunicaci\u00f3n)/i.test(t));
    });
    if (softSkillKeywords.length > 0) {
      structured.competencies = softSkillKeywords.map(s => s.charAt(0).toUpperCase() + s.slice(1));
      changes.push({ section: 'competencies', type: 'added' });
    }
  }

  // Build plain text version
  const textLines = [];
  textLines.push(structured.name.toUpperCase());
  if (structured.title) textLines.push(structured.title);

  const contactParts = [];
  if (structured.contact.phone) contactParts.push(structured.contact.phone);
  if (structured.contact.email) contactParts.push(structured.contact.email);
  if (structured.contact.location) contactParts.push(structured.contact.location);
  if (structured.contact.portfolio) contactParts.push(structured.contact.portfolio);
  if (structured.contact.github) contactParts.push(structured.contact.github);
  if (structured.contact.linkedin) contactParts.push(structured.contact.linkedin);
  if (contactParts.length > 0) textLines.push(contactParts.join(' | '));

  textLines.push('');
  textLines.push('---');
  textLines.push('');

  textLines.push(isES ? 'PERFIL PROFESIONAL' : 'PROFESSIONAL PROFILE');
  textLines.push('');
  textLines.push(structured.profile);
  textLines.push('');
  textLines.push('---');
  textLines.push('');

  if (structured.experience.length > 0) {
    textLines.push(isES ? 'EXPERIENCIA' : 'EXPERIENCE');
    textLines.push('');
    structured.experience.forEach((exp) => {
      const header = [exp.role, exp.company].filter(Boolean).join(' \u2014 ');
      textLines.push(exp.period ? `${header} | ${exp.period}` : header);
      exp.bullets.forEach((b) => textLines.push(`\u2022 ${b}`));
      textLines.push('');
    });
    textLines.push('---');
    textLines.push('');
  }

  if (structured.projects.length > 0) {
    textLines.push(isES ? 'PROYECTOS' : 'PROJECTS');
    textLines.push('');
    structured.projects.forEach((proj) => {
      const header = [proj.name, proj.stack].filter(Boolean).join(' \u2014 ');
      textLines.push(header);
      proj.bullets.forEach((b) => textLines.push(`\u2022 ${b}`));
      if (proj.demo) textLines.push(`Demo: ${proj.demo}`);
      textLines.push('');
    });
    textLines.push('---');
    textLines.push('');
  }

  textLines.push(isES ? 'HABILIDADES T\u00c9CNICAS' : 'TECHNICAL SKILLS');
  textLines.push('');
  Object.entries(structured.skills).forEach(([cat, skills]) => {
    if (Object.keys(structured.skills).length > 1) {
      textLines.push(`${cat}: ${skills.join(', ')}`);
    } else {
      textLines.push(skills.join(' | '));
    }
  });
  textLines.push('');
  textLines.push('---');
  textLines.push('');

  if (structured.education.length > 0) {
    textLines.push(isES ? 'EDUCACI\u00d3N' : 'EDUCATION');
    textLines.push('');
    structured.education.forEach((edu) => {
      const parts = [edu.program, edu.institution, edu.period].filter(Boolean);
      textLines.push(parts.join(' \u2014 '));
    });
    textLines.push('');
  }

  if (structured.languages) {
    textLines.push(isES ? 'IDIOMAS' : 'LANGUAGES');
    textLines.push('');
    textLines.push(structured.languages);
    textLines.push('');
  }

  if (structured.competencies.length > 0) {
    textLines.push(isES ? 'COMPETENCIAS CLAVE' : 'KEY COMPETENCIES');
    textLines.push('');
    textLines.push(structured.competencies.join(' | '));
    textLines.push('');
  }

  return {
    text: textLines.join('\n'),
    structured,
    changes,
    addedSkills: addedSkillsList,
    reorderedSkills: matchedSkills,
  };
}
