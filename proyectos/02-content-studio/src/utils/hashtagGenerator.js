// ─── RELEVANT HASHTAG GENERATOR ─────────────────────────────────────────────

export function generateRelevantHashtags(brand, platform, lang) {
  const { productName, audience, adjectives, coreBenefit } = brand;
  const tags = new Set();

  // From product name words
  productName.split(/\s+/).filter(w => w.length > 3).forEach(w => {
    tags.add('#' + w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00c1\u00c9\u00cd\u00d3\u00da\u00d1]/g, ''));
  });

  // From audience
  if (audience) {
    audience.split(/\s+/).filter(w => w.length > 4).slice(0, 2).forEach(w => {
      tags.add('#' + w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00c1\u00c9\u00cd\u00d3\u00da\u00d1]/g, ''));
    });
  }

  // From adjectives
  adjectives.slice(0, 2).forEach(a => tags.add('#' + a.charAt(0).toUpperCase() + a.slice(1)));

  // From benefit keywords
  if (coreBenefit) {
    coreBenefit.split(/\s+/).filter(w => w.length > 4).slice(0, 2).forEach(w => {
      tags.add('#' + w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00c1\u00c9\u00cd\u00d3\u00da\u00d1]/g, ''));
    });
  }

  // Pad with platform tags
  const platformTags = {
    instagram: ['#InstaPost', '#ContentCreator'],
    'twitter/x': ['#Thread', '#TechTwitter'],
    twitter: ['#Thread', '#TechTwitter'],
    linkedin: ['#LinkedInPost', '#Professional'],
    facebook: ['#FacebookMarketing', '#Community'],
  };
  const extras = platformTags[platform.toLowerCase()] || ['#Marketing', '#Digital'];
  extras.forEach(t => tags.add(t));

  return [...tags].slice(0, 5);
}
