// ─── GRAMMAR CORRECTION + NATURAL LANGUAGE LAYER ────────────────────────────

// Helper: convert Spanish conjugated verb to infinitive form
export function cleanInfinitive(text) {
  if (!text) return '';
  return text
    .replace(/^reduce\b/i, 'reducir')
    .replace(/^mejora\b/i, 'mejorar')
    .replace(/^aumenta\b/i, 'aumentar')
    .replace(/^disminuye\b/i, 'disminuir')
    .replace(/^elimina\b/i, 'eliminar')
    .replace(/^genera\b/i, 'generar')
    .replace(/^crea\b/i, 'crear')
    .replace(/^obtiene\b/i, 'obtener')
    .replace(/^logra\b/i, 'lograr')
    .replace(/^alcanza\b/i, 'alcanzar')
    .replace(/^transforma\b/i, 'transformar')
    .replace(/^optimiza\b/i, 'optimizar')
    .replace(/^automatiza\b/i, 'automatizar')
    .replace(/^gestiona\b/i, 'gestionar')
    .replace(/^analiza\b/i, 'analizar')
    .replace(/^detecta\b/i, 'detectar')
    .replace(/^procesa\b/i, 'procesar')
    .replace(/^conecta\b/i, 'conectar');
}

// Helper: enforce max length with clean word-boundary truncation
export function enforceMaxLength(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.6) {
    return truncated.slice(0, lastSpace);
  }
  return truncated;
}

// Main grammar corrector — fixes broken grammar in generated text
export function correctGrammar(text, lang) {
  if (!text || text.length < 3) return text;
  let fixed = text;

  if (lang === 'es') {
    // "para reduce" -> "para reducir" (infinitive after para)
    fixed = fixed.replace(/\bpara\s+(reduce|mejora|aumenta|disminuye|elimina|genera|crea|obtiene|logra|alcanza|transforma|optimiza|automatiza|gestiona|analiza|detecta|procesa|conecta)/gi, (match, verb) => {
      const infinitives = {
        'reduce': 'reducir', 'mejora': 'mejorar', 'aumenta': 'aumentar', 'disminuye': 'disminuir',
        'elimina': 'eliminar', 'genera': 'generar', 'crea': 'crear', 'obtiene': 'obtener',
        'logra': 'lograr', 'alcanza': 'alcanzar', 'transforma': 'transformar', 'optimiza': 'optimizar',
        'automatiza': 'automatizar', 'gestiona': 'gestionar', 'analiza': 'analizar',
        'detecta': 'detectar', 'procesa': 'procesar', 'conecta': 'conectar',
      };
      return `para ${infinitives[verb.toLowerCase()] || verb}`;
    });

    // "que reducir" -> "que reduce" (conjugated after que)
    fixed = fixed.replace(/\bque\s+(reducir|mejorar|aumentar|disminuir|eliminar|generar|crear|obtener|lograr|transformar|optimizar|automatizar|gestionar|analizar|detectar|procesar|conectar)/gi, (match, verb) => {
      const conjugated = {
        'reducir': 'reduce', 'mejorar': 'mejora', 'aumentar': 'aumenta', 'disminuir': 'disminuye',
        'eliminar': 'elimina', 'generar': 'genera', 'crear': 'crea', 'obtener': 'obtiene',
        'lograr': 'logra', 'transformar': 'transforma', 'optimizar': 'optimiza',
        'automatizar': 'automatiza', 'gestionar': 'gestiona', 'analizar': 'analiza',
        'detectar': 'detecta', 'procesar': 'procesa', 'conectar': 'conecta',
      };
      return `que ${conjugated[verb.toLowerCase()] || verb}`;
    });

    // Fix repeated fragments
    fixed = fixed.replace(/(\ben\s+\d+\s+\w+)\s+en\s+\d+/gi, '$1');
    fixed = fixed.replace(/(\bal\s+día)\s+al\s+día/gi, '$1');

    // Capitalize first letter
    fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);

    // Remove trailing fragments
    if (fixed.length > 10 && !/[.!?…]$/.test(fixed)) {
      const lastSpace = fixed.lastIndexOf(' ');
      if (lastSpace > 0) {
        const lastWord = fixed.slice(lastSpace + 1);
        const truncationWords = ['de', 'del', 'en', 'con', 'para', 'por', 'a', 'al', 'el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'que', 'se'];
        if (truncationWords.includes(lastWord.toLowerCase())) {
          fixed = fixed.slice(0, lastSpace).trim();
        }
      }
    }

    fixed = fixed.replace(/\s{2,}/g, ' ').trim();

  } else {
    // English grammar fixes
    fixed = fixed.replace(/\bfor\s+(reduces|improves|increases|eliminates|generates|creates|transforms|optimizes|automates|analyzes|detects)/gi, (match, verb) => {
      const base = verb.toLowerCase().replace(/es$/, 'e').replace(/s$/, '');
      return `to ${base}`;
    });

    fixed = fixed.replace(/(\bin\s+\d+\s+\w+)\s+in\s+\d+/gi, '$1');

    fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);

    const lastSpace = fixed.lastIndexOf(' ');
    if (lastSpace > 0) {
      const lastWord = fixed.slice(lastSpace + 1).toLowerCase();
      const truncWords = ['in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'the', 'a', 'an', 'and', 'or', 'that'];
      if (truncWords.includes(lastWord)) {
        fixed = fixed.slice(0, lastSpace).trim();
      }
    }

    fixed = fixed.replace(/\s{2,}/g, ' ').trim();
  }

  return fixed;
}
