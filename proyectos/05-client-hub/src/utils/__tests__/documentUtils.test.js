import { describe, it, expect } from 'vitest';
import { fileTypeFromName, parseSizeMB } from '../documentUtils.js';

describe('fileTypeFromName', () => {
  it('detects PDF files', () => {
    expect(fileTypeFromName('report.pdf')).toBe('PDF');
  });

  it('detects Figma files', () => {
    expect(fileTypeFromName('design.fig')).toBe('Figma');
  });

  it('detects image files (PNG)', () => {
    expect(fileTypeFromName('photo.png')).toBe('IMG');
  });

  it('detects image files (JPG)', () => {
    expect(fileTypeFromName('photo.jpg')).toBe('IMG');
  });

  it('detects image files (SVG)', () => {
    expect(fileTypeFromName('icon.svg')).toBe('IMG');
  });

  it('detects DOC files', () => {
    expect(fileTypeFromName('document.docx')).toBe('DOC');
  });

  it('detects XLS files', () => {
    expect(fileTypeFromName('spreadsheet.xlsx')).toBe('XLS');
  });

  it('detects ZIP files', () => {
    expect(fileTypeFromName('archive.zip')).toBe('ZIP');
  });

  it('detects RAR as ZIP', () => {
    expect(fileTypeFromName('archive.rar')).toBe('ZIP');
  });

  it('returns uppercase extension for unknown types', () => {
    expect(fileTypeFromName('data.csv')).toBe('CSV');
  });

  it('handles case-insensitive extensions', () => {
    expect(fileTypeFromName('REPORT.PDF')).toBe('PDF');
  });

  it('handles files with multiple dots', () => {
    expect(fileTypeFromName('my.report.v2.pdf')).toBe('PDF');
  });
});

describe('parseSizeMB', () => {
  it('parses a numeric string', () => {
    expect(parseSizeMB('2.4')).toBe(2.4);
  });

  it('parses a string with extra text (just the number)', () => {
    expect(parseSizeMB('18.2 MB')).toBe(18.2);
  });

  it('returns 0 for non-numeric input', () => {
    expect(parseSizeMB('unknown')).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(parseSizeMB('')).toBe(0);
  });

  it('parses integer strings', () => {
    expect(parseSizeMB('5')).toBe(5);
  });

  it('parses zero', () => {
    expect(parseSizeMB('0')).toBe(0);
  });
});
