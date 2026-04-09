// ─── CONTENT PERFORMANCE PREDICTOR ───────────────────────────────────────────

const PLATFORM_OPTIMAL = {
  instagram: { minLen: 100, maxLen: 2200, optimalLen: 150, hashtagOptimal: 8, emojiRatio: 0.03, ctaWeight: 1.2 },
  twitter:   { minLen: 50,  maxLen: 280,  optimalLen: 200, hashtagOptimal: 3, emojiRatio: 0.02, ctaWeight: 1.0 },
  linkedin:  { minLen: 150, maxLen: 3000, optimalLen: 1000, hashtagOptimal: 5, emojiRatio: 0.01, ctaWeight: 1.5 },
  facebook:  { minLen: 80,  maxLen: 2000, optimalLen: 400, hashtagOptimal: 3, emojiRatio: 0.02, ctaWeight: 1.3 },
};

const BEST_TIMES = {
  instagram: { general: "12:00 - 14:00", tech: "09:00 - 11:00", retail: "11:00 - 13:00", food: "17:00 - 19:00" },
  twitter:   { general: "08:00 - 10:00", tech: "10:00 - 12:00", retail: "12:00 - 15:00", food: "12:00 - 13:00" },
  linkedin:  { general: "07:00 - 09:00", tech: "08:00 - 10:00", retail: "10:00 - 12:00", food: "11:00 - 13:00" },
  facebook:  { general: "13:00 - 16:00", tech: "09:00 - 11:00", retail: "14:00 - 16:00", food: "11:00 - 13:00" },
};

const TONE_MULTIPLIERS = {
  Profesional: 1.0,
  Inspirador: 1.15,
  Urgente: 1.1,
  Divertido: 1.2,
  Minimalista: 0.95,
};

function countHashtags(content) {
  if (!content) return 0;
  const text = typeof content === "string" ? content : "";
  return (text.match(/#\w+/g) || []).length;
}

function countEmojis(text) {
  if (!text) return 0;
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  return (text.match(emojiRegex) || []).length;
}

function hasCTA(text) {
  if (!text) return false;
  const ctaPatterns = /(\bclick\b|\bsign up\b|\bsubscribe\b|\bbuy\b|\bget\b|\btry\b|\bstart\b|\bjoin\b|\bdownload\b|\blearn more\b|\bdescubre\b|\bobt[eé]n\b|\bsuscr[ií]bete\b|\bcompra\b|\bunete\b|\bprueba\b|\bdescarga\b|\bconoce m[aá]s\b|\bregistrate\b|\baprovecha\b|\blanza\b|\bvisita\b)/i;
  return ctaPatterns.test(text);
}

export function predictPerformance(content, platform, tone, industry) {
  const config = PLATFORM_OPTIMAL[platform] || PLATFORM_OPTIMAL.instagram;
  const fullText = [
    content?.headline || "",
    content?.subheadline || "",
    content?.body || "",
    content?.cta || "",
  ].join(" ");

  const hashtagCount = (content?.hashtags || []).length;
  const emojiCount = countEmojis(fullText);
  const textLength = fullText.length;
  const ctaPresent = hasCTA(content?.cta || "") || hasCTA(content?.body || "");
  const toneMultiplier = TONE_MULTIPLIERS[tone] || 1.0;

  // Length score (0-10): how close to optimal length
  const lengthDiff = Math.abs(textLength - config.optimalLen) / config.optimalLen;
  const lengthScore = Math.max(1, Math.min(10, 10 - lengthDiff * 8));

  // Hashtag score (0-10): how close to optimal hashtag count
  const hashtagDiff = Math.abs(hashtagCount - config.hashtagOptimal) / config.hashtagOptimal;
  const hashtagScore = Math.max(1, Math.min(10, 10 - hashtagDiff * 6));

  // Emoji score (0-10): based on emoji ratio
  const emojiRatio = textLength > 0 ? emojiCount / textLength : 0;
  const emojiDiff = Math.abs(emojiRatio - config.emojiRatio) / (config.emojiRatio || 0.01);
  const emojiScore = Math.max(2, Math.min(10, 10 - emojiDiff * 3));

  // CTA score (0-10)
  const ctaScore = ctaPresent ? 9 * config.ctaWeight : 3;

  // Weighted engagement score
  const rawScore = (lengthScore * 0.25 + hashtagScore * 0.2 + emojiScore * 0.15 + ctaScore * 0.4) * toneMultiplier;
  const engagementScore = Math.round(Math.max(1, Math.min(10, rawScore)) * 10) / 10;

  // Best posting time
  const industryKey = industry || "general";
  const timesForPlatform = BEST_TIMES[platform] || BEST_TIMES.instagram;
  const bestPostingTime = timesForPlatform[industryKey] || timesForPlatform.general;

  // Reach multiplier (1x-3x)
  const reachMultiplier = Math.round(Math.max(1, Math.min(3, 1 + (engagementScore - 4) * 0.33)) * 10) / 10;

  // Generate tips
  const tips = [];
  if (lengthScore < 6) {
    tips.push(textLength < config.optimalLen ? "addMoreContent" : "shortenContent");
  }
  if (hashtagScore < 6) {
    tips.push(hashtagCount < config.hashtagOptimal ? "addHashtags" : "reduceHashtags");
  }
  if (!ctaPresent) {
    tips.push("addCTA");
  }
  if (emojiCount === 0 && platform !== "linkedin") {
    tips.push("addEmojis");
  }
  if (engagementScore >= 8) {
    tips.push("greatContent");
  }

  return {
    engagementScore,
    bestPostingTime,
    reachMultiplier,
    tips,
    details: {
      lengthScore: Math.round(lengthScore * 10) / 10,
      hashtagScore: Math.round(hashtagScore * 10) / 10,
      emojiScore: Math.round(emojiScore * 10) / 10,
      ctaScore: Math.round(Math.min(10, ctaScore) * 10) / 10,
    },
  };
}
