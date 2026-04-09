import { describe, it, expect } from 'vitest';
import { T, tStatus, tPriority, STATUS_KEY_MAP, PRIORITY_KEY_MAP } from '../translations.js';

describe('tStatus', () => {
  it('translates "En progreso" to Spanish', () => {
    expect(tStatus('En progreso', 'es')).toBe('En progreso');
  });

  it('translates "En progreso" to English', () => {
    expect(tStatus('En progreso', 'en')).toBe('In Progress');
  });

  it('translates "Pagada" to English', () => {
    expect(tStatus('Pagada', 'en')).toBe('Paid');
  });

  it('translates "Vencida" to English', () => {
    expect(tStatus('Vencida', 'en')).toBe('Overdue');
  });

  it('translates "Completado" to English', () => {
    expect(tStatus('Completado', 'en')).toBe('Completed');
  });

  it('returns the original key for unknown status', () => {
    expect(tStatus('Unknown', 'es')).toBe('Unknown');
  });

  it('translates "Abierto" to English', () => {
    expect(tStatus('Abierto', 'en')).toBe('Open');
  });
});

describe('tPriority', () => {
  it('translates "Alta" to English', () => {
    expect(tPriority('Alta', 'en')).toBe('High');
  });

  it('translates "Media" to English', () => {
    expect(tPriority('Media', 'en')).toBe('Medium');
  });

  it('translates "Baja" to English', () => {
    expect(tPriority('Baja', 'en')).toBe('Low');
  });

  it('returns original for unknown priority', () => {
    expect(tPriority('Urgente', 'en')).toBe('Urgente');
  });

  it('translates "Alta" in Spanish', () => {
    expect(tPriority('Alta', 'es')).toBe('Alta');
  });
});

describe('STATUS_KEY_MAP', () => {
  it('maps all expected statuses', () => {
    const expected = ['En progreso', 'Revisión', 'Planificación', 'Completado', 'Pagada', 'Pendiente', 'Vencida', 'Abierto', 'Resuelto'];
    expected.forEach(status => {
      expect(STATUS_KEY_MAP).toHaveProperty(status);
    });
  });
});

describe('PRIORITY_KEY_MAP', () => {
  it('maps all expected priorities', () => {
    expect(PRIORITY_KEY_MAP).toHaveProperty('Alta');
    expect(PRIORITY_KEY_MAP).toHaveProperty('Media');
    expect(PRIORITY_KEY_MAP).toHaveProperty('Baja');
  });
});

describe('T object', () => {
  it('has bilingual entries for navProjects', () => {
    expect(T.navProjects.es).toBe('Proyectos');
    expect(T.navProjects.en).toBe('Projects');
  });

  it('has function-based translations for minsAgo', () => {
    expect(T.minsAgo.es(5)).toBe('hace 5 min');
    expect(T.minsAgo.en(5)).toBe('5 min ago');
  });
});
