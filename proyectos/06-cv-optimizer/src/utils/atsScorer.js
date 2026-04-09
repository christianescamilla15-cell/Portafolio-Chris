import { findSynonymGroup, areSynonyms } from './synonyms.js';
import { extractKeywords, extractYearsRequired, extractYearsFromCV, extractEducationLevel } from './keywordAnalyzer.js';
import { generateOptimizedCV } from './optimizationEngine.js';

// ─────────────────────────────────────────────
// MAIN ANALYSIS ENGINE
// ─────────────────────────────────────────────
export function analyzeCVvsJob(cvText, jobText, language) {
  const isES = language === 'es';
  const jobKeywords = extractKeywords(jobText);
  const cvLower = cvText.toLowerCase();

  // Match keywords
  const strengths = [];
  const weaknesses = [];
  let weightedMatches = 0;
  let totalWeight = 0;

  jobKeywords.forEach((kw) => {
    totalWeight += kw.weight;
    const group = findSynonymGroup(kw.term);
    const termsToCheck = group || [kw.term];
    let found = false;
    let matchedTerm = '';
    for (const t of termsToCheck) {
      const regex = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(cvLower)) {
        found = true;
        matchedTerm = t;
        break;
      }
    }
    if (found) {
      weightedMatches += kw.weight;
      strengths.push({
        type: 'skill',
        keyword: kw.term,
        detail: isES
          ? `Se encontr\u00f3 "${matchedTerm}" en tu CV, requerido como "${kw.matchedAs}" en la vacante`
          : `Found "${matchedTerm}" in your CV, required as "${kw.matchedAs}" in the job posting`,
        weight: kw.weight,
      });
    } else {
      weaknesses.push({
        type: 'skill',
        keyword: kw.term,
        detail: isES
          ? `No se encontr\u00f3 "${kw.term}" en tu CV (mencionado como "${kw.matchedAs}" en la vacante)`
          : `"${kw.term}" not found in your CV (mentioned as "${kw.matchedAs}" in the posting)`,
        weight: kw.weight,
      });
    }
  });

  // Years of experience
  const yearsRequired = extractYearsRequired(jobText);
  const yearsInCV = extractYearsFromCV(cvText);
  if (yearsRequired) {
    totalWeight += 2;
    if (yearsInCV && yearsInCV >= yearsRequired) {
      weightedMatches += 2;
      strengths.push({
        type: 'experience',
        keyword: isES ? 'experiencia' : 'experience',
        detail: isES
          ? `Tu experiencia (${yearsInCV} a\u00f1os) cumple o supera lo requerido (${yearsRequired} a\u00f1os)`
          : `Your experience (${yearsInCV} years) meets or exceeds the requirement (${yearsRequired} years)`,
        weight: 2,
      });
    } else {
      const cvYrs = yearsInCV || '?';
      weaknesses.push({
        type: 'experience',
        keyword: isES ? 'experiencia' : 'experience',
        detail: isES
          ? `La vacante pide ${yearsRequired} a\u00f1os de experiencia. Tu CV muestra ~${cvYrs} a\u00f1os`
          : `The job requires ${yearsRequired} years of experience. Your CV shows ~${cvYrs} years`,
        weight: 2,
      });
      if (yearsInCV) {
        weightedMatches += Math.min(1.5, (yearsInCV / yearsRequired) * 2);
      }
    }
  }

  // Education
  const jobEdu = extractEducationLevel(jobText);
  const cvEdu = extractEducationLevel(cvText);
  if (jobEdu.level > 0) {
    totalWeight += 1.5;
    if (cvEdu.level >= jobEdu.level) {
      weightedMatches += 1.5;
      strengths.push({
        type: 'education',
        keyword: isES ? 'educaci\u00f3n' : 'education',
        detail: isES
          ? `Tu nivel educativo (${cvEdu.label}) cumple con lo solicitado (${jobEdu.label})`
          : `Your education level (${cvEdu.label}) meets the requirement (${jobEdu.label})`,
        weight: 1.5,
      });
    } else if (cvEdu.level > 0) {
      weightedMatches += 0.75;
      weaknesses.push({
        type: 'education',
        keyword: isES ? 'educaci\u00f3n' : 'education',
        detail: isES
          ? `La vacante solicita nivel "${jobEdu.label}" pero tu CV muestra "${cvEdu.label}"`
          : `The job requires "${jobEdu.label}" level but your CV shows "${cvEdu.label}"`,
        weight: 1.5,
      });
    } else {
      weaknesses.push({
        type: 'education',
        keyword: isES ? 'educaci\u00f3n' : 'education',
        detail: isES
          ? `La vacante solicita nivel "${jobEdu.label}" pero no se detect\u00f3 nivel educativo en tu CV`
          : `The job requires "${jobEdu.label}" level but no education level detected in your CV`,
        weight: 1.5,
      });
    }
  }

  // Calculate score
  const rawScore = totalWeight > 0 ? (weightedMatches / totalWeight) * 100 : 50;
  const matchScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Generate recommendations
  const recommendations = [];
  // Missing high-weight skills
  const highWeightMissing = weaknesses.filter((w) => w.weight >= 1.5 && w.type === 'skill');
  if (highWeightMissing.length > 0) {
    recommendations.push({
      title: isES ? 'Agrega habilidades clave faltantes' : 'Add missing key skills',
      detail: isES
        ? `Considera incluir experiencia o conocimiento en: ${highWeightMissing.map((w) => w.keyword).join(', ')}`
        : `Consider including experience or knowledge in: ${highWeightMissing.map((w) => w.keyword).join(', ')}`,
    });
  }

  // Adjacent skills suggestion
  const matchedSkills = strengths.filter((s) => s.type === 'skill').map((s) => s.keyword);
  const adjacentSuggestions = [];
  weaknesses.filter((w) => w.type === 'skill').forEach((w) => {
    const group = findSynonymGroup(w.keyword);
    if (group) {
      // Check if any matched skill is in a "related" domain
      matchedSkills.forEach((ms) => {
        const msGroup = findSynonymGroup(ms);
        if (msGroup && msGroup !== group) {
          // Simple adjacency: same broad domain
        }
      });
    }
    // If the missing skill is "adjacent" to something they have
    const missingLower = w.keyword.toLowerCase();
    const adjacencies = {
      react: ['javascript', 'typescript', 'vue', 'angular', 'next'],
      vue: ['javascript', 'typescript', 'react', 'angular', 'nuxt'],
      angular: ['javascript', 'typescript', 'react', 'vue'],
      node: ['javascript', 'typescript', 'express', 'nest'],
      python: ['django', 'flask', 'fastapi', 'machine learning'],
      'machine learning': ['python', 'data science', 'deep learning', 'artificial intelligence'],
      docker: ['kubernetes', 'ci/cd', 'linux'],
      kubernetes: ['docker', 'ci/cd', 'linux'],
      aws: ['google cloud', 'microsoft azure', 'docker'],
      typescript: ['javascript'],
      javascript: ['typescript'],
    };
    if (adjacencies[missingLower]) {
      const hasAdjacent = adjacencies[missingLower].some((adj) =>
        matchedSkills.some((ms) => areSynonyms(ms, adj))
      );
      if (hasAdjacent) {
        adjacentSuggestions.push(w.keyword);
      }
    }
  });

  if (adjacentSuggestions.length > 0) {
    recommendations.push({
      title: isES ? 'Habilidades adyacentes detectadas' : 'Adjacent skills detected',
      detail: isES
        ? `Tienes habilidades relacionadas. Podr\u00edas agregar: ${adjacentSuggestions.join(', ')} si tienes algo de experiencia`
        : `You have related skills. Consider adding: ${adjacentSuggestions.join(', ')} if you have any experience with them`,
    });
  }

  // Keyword optimization recommendation
  recommendations.push({
    title: isES ? 'Optimiza con palabras clave' : 'Optimize with keywords',
    detail: isES
      ? 'Usa exactamente las mismas palabras que aparecen en la vacante. Los sistemas ATS buscan coincidencias exactas'
      : 'Use the exact same words that appear in the job posting. ATS systems look for exact matches',
  });

  if (matchScore < 70) {
    recommendations.push({
      title: isES ? 'Reescribe tu resumen profesional' : 'Rewrite your professional summary',
      detail: isES
        ? 'Tu resumen/perfil debe incluir las principales palabras clave de la vacante en las primeras 3 l\u00edneas'
        : 'Your summary/profile should include the main keywords from the job posting in the first 3 lines',
    });
  }

  recommendations.push({
    title: isES ? 'Cuantifica tus logros' : 'Quantify your achievements',
    detail: isES
      ? 'Usa n\u00fameros y m\u00e9tricas: "Increment\u00e9 ventas 30%" es mejor que "Increment\u00e9 ventas"'
      : 'Use numbers and metrics: "Increased sales by 30%" is better than "Increased sales"',
  });

  // Generate Optimized CV
  const optimizedCV = generateOptimizedCV(cvText, jobText, jobKeywords, strengths, weaknesses, language);

  return {
    matchScore,
    strengths,
    weaknesses,
    recommendations,
    optimizedCV,
    totalKeywords: jobKeywords.length,
    matchedKeywords: strengths.filter((s) => s.type === 'skill').length,
  };
}
