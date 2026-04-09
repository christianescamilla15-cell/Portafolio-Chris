// ─────────────────────────────────────────────
// INDUSTRY BENCHMARK DATA
// ─────────────────────────────────────────────

export const INDUSTRY_BENCHMARKS = {
  tech: { avg: 62, top10: 85 },
  marketing: { avg: 55, top10: 78 },
  finance: { avg: 58, top10: 82 },
  healthcare: { avg: 50, top10: 75 },
  education: { avg: 48, top10: 72 },
};

export const INDUSTRY_LABELS = {
  es: {
    tech: 'Tech / Software',
    marketing: 'Marketing',
    finance: 'Finanzas',
    healthcare: 'Salud',
    education: 'Educacion',
  },
  en: {
    tech: 'Tech / Software',
    marketing: 'Marketing',
    finance: 'Finance',
    healthcare: 'Healthcare',
    education: 'Education',
  },
};

/**
 * Keywords used to auto-detect industry from job description text.
 * Each industry maps to an array of lowercase terms.
 */
export const INDUSTRY_KEYWORDS = {
  tech: [
    'software', 'developer', 'desarrollador', 'frontend', 'backend', 'fullstack',
    'full-stack', 'react', 'node', 'javascript', 'typescript', 'python', 'java',
    'devops', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'api', 'microservices',
    'machine learning', 'data science', 'artificial intelligence', 'inteligencia artificial',
    'programador', 'ingeniero de software', 'software engineer', 'web', 'mobile',
    'ios', 'android', 'database', 'sql', 'nosql', 'agile', 'scrum', 'ci/cd',
    'git', 'linux', 'saas', 'startup', 'tech', 'tecnologia',
  ],
  marketing: [
    'marketing', 'seo', 'sem', 'content', 'contenido', 'social media', 'redes sociales',
    'brand', 'marca', 'digital marketing', 'marketing digital', 'copywriting',
    'analytics', 'google ads', 'facebook ads', 'campaign', 'campana',
    'publicidad', 'advertising', 'community manager', 'growth', 'email marketing',
    'crm', 'hubspot', 'engagement', 'influencer', 'branding',
  ],
  finance: [
    'finance', 'finanzas', 'accounting', 'contabilidad', 'banking', 'banca',
    'investment', 'inversion', 'financial', 'financiero', 'audit', 'auditoria',
    'risk', 'riesgo', 'compliance', 'cumplimiento', 'tax', 'impuestos',
    'treasury', 'tesoreria', 'portfolio', 'actuary', 'actuario', 'forex',
    'trading', 'analyst', 'analista financiero', 'budget', 'presupuesto',
  ],
  healthcare: [
    'healthcare', 'salud', 'medical', 'medico', 'hospital', 'clinical', 'clinico',
    'nursing', 'enfermeria', 'pharmaceutical', 'farmaceutico', 'biotech',
    'biotecnologia', 'patient', 'paciente', 'therapy', 'terapia', 'diagnosis',
    'diagnostico', 'health', 'wellness', 'bienestar', 'doctor', 'surgeon',
    'cirujano', 'dentist', 'dentista', 'laboratory', 'laboratorio',
  ],
  education: [
    'education', 'educacion', 'teaching', 'ensenanza', 'teacher', 'profesor',
    'academic', 'academico', 'university', 'universidad', 'school', 'escuela',
    'curriculum', 'pedagogy', 'pedagogia', 'student', 'estudiante', 'training',
    'capacitacion', 'e-learning', 'elearning', 'instructor', 'tutor',
    'research', 'investigacion', 'faculty', 'dean', 'decano',
  ],
};

/**
 * Detect the most likely industry from job description text.
 * Returns the industry key with the most keyword matches.
 */
export function detectIndustry(jobText) {
  if (!jobText) return 'tech';
  const lower = jobText.toLowerCase();
  let bestIndustry = 'tech';
  let bestCount = 0;

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    let count = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      bestIndustry = industry;
    }
  }

  return bestIndustry;
}
