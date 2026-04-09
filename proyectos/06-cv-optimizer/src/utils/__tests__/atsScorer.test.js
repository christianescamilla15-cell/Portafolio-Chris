import { describe, it, expect } from 'vitest';
import { analyzeCVvsJob } from '../atsScorer.js';

const RICH_CV = `
John Doe
Senior Software Engineer
john@example.com | +1 555-1234 | San Francisco, CA

Professional Summary
Experienced software engineer with 8 years of experience in JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, CI/CD, and agile methodologies. Led teams of 10+ engineers. Bachelor in Computer Science.

Experience
Senior Engineer - Google | 2019 - present
- Built scalable microservices with Node.js and Python
- Deployed applications using Docker and Kubernetes on AWS
- Implemented CI/CD pipelines with GitHub Actions

Software Engineer - Meta | 2016 - 2019
- Developed React frontend applications with TypeScript
- Managed PostgreSQL and MongoDB databases

Education
Bachelor in Computer Science - Stanford University, 2012 - 2016

Skills
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, CI/CD, Git, PostgreSQL, MongoDB, Agile, Scrum
`;

const JOB_DESCRIPTION = `
Senior Software Engineer

Requirements:
- 5+ years of experience in software development
- Strong proficiency in JavaScript and TypeScript (required)
- Experience with React and Node.js (required)
- Python experience (required)
- AWS cloud infrastructure (required)
- Docker and Kubernetes experience
- CI/CD pipeline implementation
- Bachelor's degree in Computer Science or related field
- Agile methodology experience

Nice to have:
- GraphQL experience (desirable)
- Machine learning knowledge (preferred)
`;

const WEAK_CV = `
Jane Smith
Junior Developer

About me
I just graduated and I am looking for my first job in tech. I learned some HTML and CSS in a bootcamp.

Education
Bootcamp in Web Development - CodeAcademy, 2023
`;

describe('analyzeCVvsJob', () => {
  it('returns a matchScore between 0 and 100', () => {
    const result = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    expect(result.matchScore).toBeGreaterThanOrEqual(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
  });

  it('high-match CV scores above 60', () => {
    const result = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    expect(result.matchScore).toBeGreaterThanOrEqual(60);
  });

  it('low-match CV scores below 50', () => {
    const result = analyzeCVvsJob(WEAK_CV, JOB_DESCRIPTION, 'en');
    expect(result.matchScore).toBeLessThan(50);
  });

  it('returns strengths and weaknesses arrays', () => {
    const result = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    expect(Array.isArray(result.strengths)).toBe(true);
    expect(Array.isArray(result.weaknesses)).toBe(true);
  });

  it('each strength has type, keyword, detail, weight', () => {
    const result = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    for (const s of result.strengths) {
      expect(s).toHaveProperty('type');
      expect(s).toHaveProperty('keyword');
      expect(s).toHaveProperty('detail');
      expect(s).toHaveProperty('weight');
    }
  });

  it('each weakness has type, keyword, detail, weight', () => {
    const result = analyzeCVvsJob(WEAK_CV, JOB_DESCRIPTION, 'en');
    expect(result.weaknesses.length).toBeGreaterThan(0);
    for (const w of result.weaknesses) {
      expect(w).toHaveProperty('type');
      expect(w).toHaveProperty('keyword');
      expect(w).toHaveProperty('detail');
      expect(w).toHaveProperty('weight');
    }
  });

  it('returns recommendations array with title and detail', () => {
    const result = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const r of result.recommendations) {
      expect(r).toHaveProperty('title');
      expect(r).toHaveProperty('detail');
    }
  });

  it('returns totalKeywords and matchedKeywords counts', () => {
    const result = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    expect(typeof result.totalKeywords).toBe('number');
    expect(typeof result.matchedKeywords).toBe('number');
    expect(result.totalKeywords).toBeGreaterThan(0);
    expect(result.matchedKeywords).toBeLessThanOrEqual(result.totalKeywords);
  });

  it('returns optimizedCV with text and structured properties', () => {
    const result = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    expect(result.optimizedCV).toBeDefined();
    expect(typeof result.optimizedCV.text).toBe('string');
    expect(result.optimizedCV.structured).toBeDefined();
  });

  it('returns consistent scores for the same inputs', () => {
    const r1 = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    const r2 = analyzeCVvsJob(RICH_CV, JOB_DESCRIPTION, 'en');
    expect(r1.matchScore).toBe(r2.matchScore);
    expect(r1.totalKeywords).toBe(r2.totalKeywords);
    expect(r1.matchedKeywords).toBe(r2.matchedKeywords);
  });

  it('handles empty CV text gracefully', () => {
    const result = analyzeCVvsJob('', JOB_DESCRIPTION, 'en');
    expect(result.matchScore).toBeGreaterThanOrEqual(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
    expect(result.weaknesses.length).toBeGreaterThan(0);
  });

  it('uses Spanish labels when language is es', () => {
    const result = analyzeCVvsJob(WEAK_CV, JOB_DESCRIPTION, 'es');
    const allDetails = [
      ...result.strengths.map((s) => s.detail),
      ...result.weaknesses.map((w) => w.detail),
    ].join(' ');
    // Spanish output should contain Spanish phrases
    const hasSpanish = allDetails.includes('encontr') || allDetails.includes('vacante') || allDetails.includes('CV');
    expect(hasSpanish).toBe(true);
  });
});
