import { describe, it, expect } from 'vitest';
import { buildPDFHtml } from '../pdfBuilder.js';

const SAMPLE_DATA = {
  name: 'John Doe',
  title: 'Senior Software Engineer',
  contact: {
    phone: '+1 555-1234',
    email: 'john@example.com',
    location: 'San Francisco, CA',
    portfolio: '',
    github: 'github.com/johndoe',
    linkedin: 'linkedin.com/in/johndoe',
  },
  profile: 'Experienced engineer with 10 years in web development.',
  experience: [
    {
      role: 'Senior Engineer',
      company: 'Google',
      period: '2019 - 2023',
      bullets: ['Built scalable microservices', 'Led a team of 8 engineers'],
    },
  ],
  projects: [
    {
      name: 'Portfolio',
      stack: 'React, Node.js',
      bullets: ['Full stack application'],
      demo: 'https://example.com',
    },
  ],
  skills: {
    Frontend: ['React', 'Vue', 'Angular'],
    Backend: ['Node.js', 'Python', 'Go'],
  },
  education: [
    { program: 'BSc Computer Science', institution: 'Stanford University', period: '2012 - 2016' },
  ],
  languages: 'English (native), Spanish (fluent)',
  competencies: ['Leadership', 'Teamwork', 'Problem Solving'],
};

describe('buildPDFHtml', () => {
  it('returns a non-empty HTML string', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(100);
  });

  it('contains the name', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('John Doe');
  });

  it('contains the title', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('Senior Software Engineer');
  });

  it('contains contact info', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('john@example.com');
    expect(html).toContain('555-1234');
    expect(html).toContain('github.com/johndoe');
  });

  it('contains profile section', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('PROFESSIONAL PROFILE');
    expect(html).toContain('Experienced engineer');
  });

  it('contains experience section with bullets', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('EXPERIENCE');
    expect(html).toContain('Senior Engineer');
    expect(html).toContain('Built scalable microservices');
  });

  it('contains projects section with demo link', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('PROJECTS');
    expect(html).toContain('Portfolio');
    expect(html).toContain('https://example.com');
  });

  it('contains skills grouped by category', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('TECHNICAL SKILLS');
    expect(html).toContain('Frontend');
    expect(html).toContain('React');
  });

  it('contains education section', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('EDUCATION');
    expect(html).toContain('BSc Computer Science');
    expect(html).toContain('Stanford University');
  });

  it('contains languages section', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('LANGUAGES');
    expect(html).toContain('English');
  });

  it('contains competencies section', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('KEY COMPETENCIES');
    expect(html).toContain('Leadership');
  });

  it('uses Spanish labels when lang is es', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'es', 'ats');
    expect(html).toContain('PERFIL PROFESIONAL');
    expect(html).toContain('EXPERIENCIA');
    expect(html).toContain('HABILIDADES');
  });

  it('applies ATS format styling', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'ats');
    expect(html).toContain('#333');
  });

  it('applies non-ATS format styling', () => {
    const html = buildPDFHtml(SAMPLE_DATA, 'en', 'modern');
    expect(html).toContain('#4F46E5');
  });

  it('escapes HTML entities in content', () => {
    const data = { ...SAMPLE_DATA, name: 'John <script>alert(1)</script> Doe' };
    const html = buildPDFHtml(data, 'en', 'ats');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('handles empty experience and projects arrays', () => {
    const data = { ...SAMPLE_DATA, experience: [], projects: [] };
    const html = buildPDFHtml(data, 'en', 'ats');
    expect(html).not.toContain('EXPERIENCE');
    expect(html).not.toContain('PROJECTS');
  });

  it('handles missing optional fields gracefully', () => {
    const minimal = {
      name: 'Test',
      title: '',
      contact: { phone: '', email: '', location: '', portfolio: '', github: '', linkedin: '' },
      profile: '',
      experience: [],
      projects: [],
      skills: {},
      education: [],
      languages: '',
      competencies: [],
    };
    const html = buildPDFHtml(minimal, 'en', 'ats');
    expect(html).toContain('Test');
  });
});
