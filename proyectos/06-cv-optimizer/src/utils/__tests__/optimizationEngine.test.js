import { describe, it, expect } from 'vitest';
import { generateOptimizedCV } from '../optimizationEngine.js';
import { extractKeywords } from '../keywordAnalyzer.js';

const CV_TEXT = `
John Doe
Senior Software Engineer
john@example.com | +1 555-1234

Profile
Experienced engineer with expertise in JavaScript, React, and Node.js.

Experience
Senior Engineer - Google | 2019 - 2023
- Built scalable applications
- Led engineering team

Skills
JavaScript, React, Node.js, Python, Docker
`;

const JOB_TEXT = `
Senior Software Engineer
Requirements:
- JavaScript and TypeScript required
- React and Node.js experience required
- AWS and Docker experience
- Machine learning knowledge preferred
- Kubernetes experience preferred
`;

const jobKeywords = extractKeywords(JOB_TEXT);

const strengths = [
  { type: 'skill', keyword: 'javascript', detail: 'Found', weight: 2 },
  { type: 'skill', keyword: 'react', detail: 'Found', weight: 2 },
  { type: 'skill', keyword: 'node', detail: 'Found', weight: 2 },
  { type: 'skill', keyword: 'docker', detail: 'Found', weight: 1.5 },
];

const weaknesses = [
  { type: 'skill', keyword: 'typescript', detail: 'Not found', weight: 2 },
  { type: 'skill', keyword: 'amazon web services', detail: 'Not found', weight: 1.5 },
  { type: 'skill', keyword: 'machine learning', detail: 'Not found', weight: 1 },
  { type: 'skill', keyword: 'kubernetes', detail: 'Not found', weight: 1 },
];

describe('generateOptimizedCV', () => {
  it('returns an object with text, structured, changes, addedSkills, reorderedSkills', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('structured');
    expect(result).toHaveProperty('changes');
    expect(result).toHaveProperty('addedSkills');
    expect(result).toHaveProperty('reorderedSkills');
  });

  it('returns a non-empty text string', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(typeof result.text).toBe('string');
    expect(result.text.length).toBeGreaterThan(100);
  });

  it('structured output has name, profile, experience, skills', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    const s = result.structured;
    expect(s.name).toBeDefined();
    expect(s.profile).toBeDefined();
    expect(s.experience).toBeDefined();
    expect(s.skills).toBeDefined();
  });

  it('adds missing skills to the output', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(result.addedSkills.length).toBeGreaterThan(0);
  });

  it('includes matched skills in reorderedSkills', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(result.reorderedSkills).toContain('javascript');
    expect(result.reorderedSkills).toContain('react');
  });

  it('changes array contains modification entries', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(result.changes.length).toBeGreaterThan(0);
    for (const c of result.changes) {
      expect(c).toHaveProperty('section');
      expect(c).toHaveProperty('type');
    }
  });

  it('profile includes key competencies/keywords', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(result.structured.profile.toLowerCase()).toContain('competenc');
  });

  it('handles empty CV text without crashing', () => {
    const result = generateOptimizedCV('', JOB_TEXT, jobKeywords, [], weaknesses, 'en');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('structured');
  });

  it('handles empty weaknesses (perfect CV)', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, [], 'en');
    expect(result.addedSkills).toEqual([]);
  });

  it('generates Spanish output when language is es', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'es');
    expect(result.text).toContain('PERFIL PROFESIONAL');
    expect(result.text).toContain('HABILIDADES');
  });

  it('preserves original experience entries', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(result.structured.experience.length).toBeGreaterThanOrEqual(1);
  });

  it('text output contains section separators', () => {
    const result = generateOptimizedCV(CV_TEXT, JOB_TEXT, jobKeywords, strengths, weaknesses, 'en');
    expect(result.text).toContain('---');
  });
});
