import { describe, it, expect } from 'vitest';
import { parseCV } from '../cvParser.js';

const FULL_CV = `
John Doe
Senior Software Engineer
john@example.com | +1 555-1234 | github.com/johndoe | linkedin.com/in/johndoe | San Francisco, CA

Profile
Experienced engineer with 10 years in web development and cloud infrastructure.

Experience
Senior Engineer - Google | 2019 - 2023
- Built scalable microservices
- Led a team of 8 engineers

Software Engineer - Meta | 2016 - 2019
- Developed React applications
- Managed CI/CD pipelines

Education
BSc Computer Science - Stanford University, 2012 - 2016

Skills
Frontend: React, Vue, Angular
Backend: Node.js, Python, Go
DevOps: Docker, Kubernetes, AWS

Languages
English (native), Spanish (fluent)

Certifications
AWS Solutions Architect - 2022
`;

describe('parseCV', () => {
  it('returns an object with expected top-level properties', () => {
    const result = parseCV(FULL_CV);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('contact');
    expect(result).toHaveProperty('profile');
    expect(result).toHaveProperty('experience');
    expect(result).toHaveProperty('skills');
    expect(result).toHaveProperty('education');
    expect(result).toHaveProperty('languages');
    expect(result).toHaveProperty('rawSections');
  });

  it('extracts name from header', () => {
    const result = parseCV(FULL_CV);
    expect(result.name).toBe('John Doe');
  });

  it('extracts title from header', () => {
    const result = parseCV(FULL_CV);
    expect(result.title).toBe('Senior Software Engineer');
  });

  it('extracts email from contact info', () => {
    const result = parseCV(FULL_CV);
    expect(result.contact.email).toBe('john@example.com');
  });

  it('extracts phone from contact info', () => {
    const result = parseCV(FULL_CV);
    expect(result.contact.phone).toContain('555-1234');
  });

  it('extracts github URL', () => {
    const result = parseCV(FULL_CV);
    expect(result.contact.github).toContain('github.com/johndoe');
  });

  it('extracts linkedin URL', () => {
    const result = parseCV(FULL_CV);
    expect(result.contact.linkedin).toContain('linkedin.com/in/johndoe');
  });

  it('extracts profile section text', () => {
    const result = parseCV(FULL_CV);
    expect(result.profile).toContain('Experienced engineer');
  });

  it('parses experience entries', () => {
    const result = parseCV(FULL_CV);
    expect(result.experience.length).toBeGreaterThanOrEqual(2);
    expect(result.experience[0]).toHaveProperty('role');
    expect(result.experience[0]).toHaveProperty('company');
    expect(result.experience[0]).toHaveProperty('period');
    expect(result.experience[0]).toHaveProperty('bullets');
  });

  it('extracts experience bullets', () => {
    const result = parseCV(FULL_CV);
    const firstEntry = result.experience[0];
    expect(firstEntry.bullets.length).toBeGreaterThan(0);
  });

  it('parses skills into categories', () => {
    const result = parseCV(FULL_CV);
    expect(Object.keys(result.skills).length).toBeGreaterThanOrEqual(2);
    expect(result.skills['Frontend']).toBeDefined();
    expect(result.skills['Backend']).toBeDefined();
  });

  it('parses education entries', () => {
    const result = parseCV(FULL_CV);
    expect(result.education.length).toBeGreaterThanOrEqual(1);
    expect(result.education[0]).toHaveProperty('program');
    expect(result.education[0]).toHaveProperty('institution');
    expect(result.education[0]).toHaveProperty('period');
  });

  it('parses languages section', () => {
    const result = parseCV(FULL_CV);
    expect(result.languages).toContain('English');
    expect(result.languages).toContain('Spanish');
  });

  it('handles empty CV text', () => {
    const result = parseCV('');
    expect(result.name).toBe('');
    expect(result.experience).toEqual([]);
    expect(result.education).toEqual([]);
  });

  it('handles CV with no sections (plain text)', () => {
    const text = 'This is just a block of text with no section headers at all.';
    const result = parseCV(text);
    expect(result.name).toBe('This is just a block of text with no section headers at all.');
    expect(result.experience).toEqual([]);
  });

  it('handles Spanish section headers', () => {
    const spanishCV = `
Maria Garcia
Desarrolladora Web

Experiencia
Developer - Empresa | 2020 - 2023
- Desarrollo de aplicaciones web

Habilidades
JavaScript, React, Node.js

Educacion
Licenciatura en Sistemas - UNAM, 2016 - 2020
`;
    const result = parseCV(spanishCV);
    expect(result.experience.length).toBeGreaterThanOrEqual(1);
  });

  it('stores raw sections', () => {
    const result = parseCV(FULL_CV);
    expect(Object.keys(result.rawSections).length).toBeGreaterThan(0);
    expect(result.rawSections['profile']).toBeDefined();
    expect(result.rawSections['experience']).toBeDefined();
  });

  it('extracts location from contact line', () => {
    const result = parseCV(FULL_CV);
    expect(result.contact.location).toContain('San Francisco');
  });
});
