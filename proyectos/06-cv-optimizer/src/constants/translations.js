export const UI_TRANSLATIONS = {
  es: {
    diffView: 'Diferencias',
    fullView: 'Completa',
    originalCV: 'CV Original',
    optimizedCV: 'CV Optimizado',
    additions: 'adiciones',
    removals: 'eliminaciones',
    changes: 'cambios',
    industryBenchmark: 'Benchmark de la industria',
    industryAverage: 'Promedio de la industria',
    topPercentile: 'Top 10%',
    yourScore: 'Tu CV',
    belowAverage: 'Por debajo del promedio',
    aboveAverage: 'Por encima del promedio',
    keywordCloud: 'Nube de palabras clave',
    keywordFrequency: 'Frecuencia de palabra clave',
    matchedKeyword: 'Palabra clave encontrada',
    missingKeyword: 'Palabra clave faltante',
  },
  en: {
    diffView: 'Diff',
    fullView: 'Full',
    originalCV: 'Original CV',
    optimizedCV: 'Optimized CV',
    additions: 'additions',
    removals: 'removals',
    changes: 'changes',
    industryBenchmark: 'Industry Benchmark',
    industryAverage: 'Industry average',
    topPercentile: 'Top 10%',
    yourScore: 'Your CV',
    belowAverage: 'Below average',
    aboveAverage: 'Above average',
    keywordCloud: 'Keyword Cloud',
    keywordFrequency: 'Keyword frequency',
    matchedKeyword: 'Matched keyword',
    missingKeyword: 'Missing keyword',
  },
};

export const TRANSLATION_MAP = {
  esToEn: {
    'PERFIL PROFESIONAL': 'PROFESSIONAL PROFILE',
    'EXPERIENCIA': 'EXPERIENCE',
    'PROYECTOS': 'PROJECTS',
    'HABILIDADES T\u00c9CNICAS': 'TECHNICAL SKILLS',
    'EDUCACI\u00d3N': 'EDUCATION',
    'IDIOMAS': 'LANGUAGES',
    'COMPETENCIAS CLAVE': 'KEY COMPETENCIES',
    'CERTIFICACIONES': 'CERTIFICATIONS',
    'Competencias clave': 'Key competencies',
    'Profesional con experiencia en': 'Professional with experience in',
    'Orientado a resultados con capacidad de adaptaci\u00f3n a nuevas tecnolog\u00edas y metodolog\u00edas': 'Results-oriented with ability to adapt to new technologies and methodologies',
    'Presente': 'Present', 'Actual': 'Present', 'Actualidad': 'Present',
    'Espa\u00f1ol nativo': 'Native Spanish', 'Ingl\u00e9s': 'English',
    'Disponible': 'Available', 'Remoto': 'Remote',
    'Tecnolog\u00edas': 'Technologies', 'Adicionales (de la vacante)': 'Additional (from job posting)',
    'Otros': 'Others',
  },
  enToEs: {
    'PROFESSIONAL PROFILE': 'PERFIL PROFESIONAL',
    'EXPERIENCE': 'EXPERIENCIA',
    'PROJECTS': 'PROYECTOS',
    'TECHNICAL SKILLS': 'HABILIDADES T\u00c9CNICAS',
    'EDUCATION': 'EDUCACI\u00d3N',
    'LANGUAGES': 'IDIOMAS',
    'KEY COMPETENCIES': 'COMPETENCIAS CLAVE',
    'CERTIFICATIONS': 'CERTIFICACIONES',
    'Key competencies': 'Competencias clave',
    'Professional with experience in': 'Profesional con experiencia en',
    'Results-oriented with ability to adapt to new technologies and methodologies': 'Orientado a resultados con capacidad de adaptaci\u00f3n a nuevas tecnolog\u00edas y metodolog\u00edas',
    'Present': 'Presente',
    'Native Spanish': 'Espa\u00f1ol nativo', 'English': 'Ingl\u00e9s',
    'Available': 'Disponible', 'Remote': 'Remoto',
    'Technologies': 'Tecnolog\u00edas', 'Additional (from job posting)': 'Adicionales (de la vacante)',
    'Others': 'Otros',
  },
};

export function translateStructured(structured, targetLang) {
  const map = targetLang === 'en' ? TRANSLATION_MAP.esToEn : TRANSLATION_MAP.enToEs;
  const applyMap = (text) => {
    let result = text;
    Object.entries(map).forEach(([from, to]) => {
      result = result.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), to);
    });
    return result;
  };

  return {
    ...structured,
    profile: applyMap(structured.profile),
    experience: structured.experience.map(e => ({
      ...e,
      bullets: e.bullets.map(b => applyMap(b)),
    })),
    projects: structured.projects.map(p => ({
      ...p,
      bullets: p.bullets.map(b => applyMap(b)),
    })),
    skills: Object.fromEntries(
      Object.entries(structured.skills).map(([cat, skills]) => [applyMap(cat), skills])
    ),
    education: structured.education.map(e => ({
      ...e,
      program: applyMap(e.program),
    })),
    languages: applyMap(structured.languages),
    competencies: structured.competencies.map(c => applyMap(c)),
  };
}
