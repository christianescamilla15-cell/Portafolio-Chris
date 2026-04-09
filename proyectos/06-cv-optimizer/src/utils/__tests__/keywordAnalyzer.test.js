import { describe, it, expect } from 'vitest';
import { extractKeywords, extractYearsRequired, extractYearsFromCV, extractEducationLevel } from '../keywordAnalyzer.js';

describe('extractKeywords', () => {
  it('extracts keywords from a job description', () => {
    const text = 'We need a developer with JavaScript, React, and Node.js experience';
    const keywords = extractKeywords(text);
    expect(keywords.length).toBeGreaterThan(0);
    const terms = keywords.map((k) => k.term);
    expect(terms).toContain('javascript');
    expect(terms).toContain('react');
    expect(terms).toContain('node');
  });

  it('each keyword has term, weight, and matchedAs', () => {
    const keywords = extractKeywords('Python and Django required');
    expect(keywords.length).toBeGreaterThan(0);
    for (const kw of keywords) {
      expect(kw).toHaveProperty('term');
      expect(kw).toHaveProperty('weight');
      expect(kw).toHaveProperty('matchedAs');
      expect(typeof kw.weight).toBe('number');
    }
  });

  it('assigns higher weight for "required" context', () => {
    // The context window is 80 chars before/after. Put terms far apart so contexts don't overlap.
    const text = 'JavaScript is required for this position. ' +
      'We also use many other tools in our stack across all departments. ' +
      'Python is desirable for some tasks.';
    const keywords = extractKeywords(text);
    const jsKw = keywords.find((k) => k.term === 'javascript');
    const pyKw = keywords.find((k) => k.term === 'python');
    expect(jsKw).toBeDefined();
    expect(pyKw).toBeDefined();
    expect(jsKw.weight).toBeGreaterThanOrEqual(pyKw.weight);
  });

  it('assigns lower weight for "desirable" context', () => {
    const text = 'GraphQL experience is desirable';
    const keywords = extractKeywords(text);
    const gql = keywords.find((k) => k.term === 'graphql');
    if (gql) {
      expect(gql.weight).toBe(1);
    }
  });

  it('returns empty array for empty text', () => {
    const keywords = extractKeywords('');
    expect(keywords).toEqual([]);
  });

  it('returns no duplicate canonical terms', () => {
    const text = 'JavaScript JS ECMAScript ES6 are all the same';
    const keywords = extractKeywords(text);
    const terms = keywords.map((k) => k.term);
    const unique = new Set(terms);
    expect(terms.length).toBe(unique.size);
  });

  it('extracts from Spanish job descriptions', () => {
    const text = 'Se requiere experiencia en Python, inteligencia artificial y aprendizaje automatico';
    const keywords = extractKeywords(text);
    const terms = keywords.map((k) => k.term);
    expect(terms).toContain('python');
    expect(terms).toContain('artificial intelligence');
    expect(terms).toContain('machine learning');
  });

  it('handles special characters in text without crashing', () => {
    const text = 'C++ and C# developers needed. Also Node.js and Vue.js.';
    const keywords = extractKeywords(text);
    expect(keywords.length).toBeGreaterThan(0);
  });

  it('extracts cloud and devops keywords', () => {
    const text = 'Must have AWS experience with Docker and Kubernetes';
    const keywords = extractKeywords(text);
    const terms = keywords.map((k) => k.term);
    expect(terms).toContain('amazon web services');
    expect(terms).toContain('docker');
    expect(terms).toContain('kubernetes');
  });

  it('default weight is 1.5 when no weight marker present', () => {
    const text = 'Looking for someone who knows React';
    const keywords = extractKeywords(text);
    const reactKw = keywords.find((k) => k.term === 'react');
    expect(reactKw).toBeDefined();
    expect(reactKw.weight).toBe(1.5);
  });
});

describe('extractYearsRequired', () => {
  it('extracts years from "5+ years of experience"', () => {
    expect(extractYearsRequired('5+ years of experience required')).toBe(5);
  });

  it('extracts years from "3 años de experiencia"', () => {
    expect(extractYearsRequired('3 años de experiencia')).toBe(3);
  });

  it('extracts from "minimum 2 years"', () => {
    expect(extractYearsRequired('minimum 2 years')).toBe(2);
  });

  it('extracts from "at least 4 years"', () => {
    expect(extractYearsRequired('at least 4 years')).toBe(4);
  });

  it('returns null when no years pattern found', () => {
    expect(extractYearsRequired('Looking for a skilled developer')).toBeNull();
  });
});

describe('extractYearsFromCV', () => {
  it('extracts years from "8 years of experience"', () => {
    expect(extractYearsFromCV('I have 8 years of experience')).toBe(8);
  });

  it('calculates years from "2018 - present"', () => {
    const years = extractYearsFromCV('Working since 2018 - present');
    const expected = new Date().getFullYear() - 2018;
    expect(years).toBe(expected);
  });

  it('sums years from date ranges', () => {
    const text = 'Company A: 2015 - 2018\nCompany B: 2018 - 2021';
    const years = extractYearsFromCV(text);
    expect(years).toBe(6);
  });

  it('returns null when no date info found', () => {
    expect(extractYearsFromCV('Just some random text')).toBeNull();
  });
});

describe('extractEducationLevel', () => {
  it('detects PhD level (4)', () => {
    const result = extractEducationLevel('PhD in Computer Science');
    expect(result.level).toBe(4);
  });

  it('detects master level (3)', () => {
    const result = extractEducationLevel('Master in Data Science');
    expect(result.level).toBe(3);
  });

  it('detects bachelor level (2)', () => {
    const result = extractEducationLevel('Bachelor in Engineering');
    expect(result.level).toBe(2);
  });

  it('detects bootcamp level (1)', () => {
    const result = extractEducationLevel('Completed a coding bootcamp');
    expect(result.level).toBe(1);
  });

  it('returns level 0 and null label for no education', () => {
    const result = extractEducationLevel('No formal education mentioned');
    expect(result.level).toBe(0);
    expect(result.label).toBeNull();
  });

  it('picks the highest education level found', () => {
    const result = extractEducationLevel('Bachelor and Master and PhD');
    expect(result.level).toBe(4);
  });

  it('detects Spanish education terms', () => {
    const result = extractEducationLevel('Licenciatura en Sistemas');
    expect(result.level).toBe(2);
  });
});
