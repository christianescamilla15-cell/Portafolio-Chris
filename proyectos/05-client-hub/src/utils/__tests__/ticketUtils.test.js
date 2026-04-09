import { describe, it, expect } from 'vitest';
import { getNextTicketStatus } from '../ticketUtils.js';

describe('getNextTicketStatus', () => {
  it('transitions Abierto to En progreso', () => {
    expect(getNextTicketStatus('Abierto')).toBe('En progreso');
  });

  it('transitions En progreso to Resuelto', () => {
    expect(getNextTicketStatus('En progreso')).toBe('Resuelto');
  });

  it('returns null for last status (Resuelto)', () => {
    expect(getNextTicketStatus('Resuelto')).toBeNull();
  });

  it('returns null for unknown status', () => {
    expect(getNextTicketStatus('InvalidStatus')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getNextTicketStatus('')).toBeNull();
  });

  it('is case-sensitive (lowercase does not match)', () => {
    expect(getNextTicketStatus('abierto')).toBeNull();
  });
});
