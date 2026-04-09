import { describe, it, expect, beforeEach, vi } from 'vitest';

// Create a proper localStorage mock
const store = {};
const localStorageMock = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = String(value); }),
  removeItem: vi.fn((key) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Import after mocking
const { loadHistory, saveToHistory, clearHistory, loadStats, trackGeneration, topEntry } = await import('../useContentHistory.js');

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  vi.clearAllMocks();
});

describe('loadHistory', () => {
  it('returns an empty array when no history exists', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('returns saved entries', () => {
    store['cs_history'] = JSON.stringify([{ id: 1 }]);
    expect(loadHistory()).toEqual([{ id: 1 }]);
  });

  it('returns empty array for corrupted JSON', () => {
    store['cs_history'] = 'not-json';
    expect(loadHistory()).toEqual([]);
  });
});

describe('saveToHistory', () => {
  it('adds an entry to history', () => {
    const result = saveToHistory({ id: 1, brand: 'test' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('prepends new entries (most recent first)', () => {
    saveToHistory({ id: 1 });
    const result = saveToHistory({ id: 2 });
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(1);
  });

  it('limits history to 20 entries', () => {
    for (let i = 0; i < 25; i++) {
      saveToHistory({ id: i });
    }
    const hist = loadHistory();
    expect(hist).toHaveLength(20);
  });
});

describe('clearHistory', () => {
  it('removes all history from storage', () => {
    saveToHistory({ id: 1 });
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});

describe('loadStats', () => {
  it('returns default stats object when empty', () => {
    const stats = loadStats();
    expect(stats.total).toBe(0);
    expect(stats.platforms).toEqual({});
    expect(stats.tones).toEqual({});
    expect(stats.formats).toEqual({});
  });

  it('returns saved stats', () => {
    trackGeneration('instagram', 'Profesional', 'Producto', false);
    const stats = loadStats();
    expect(stats.total).toBe(1);
    expect(stats.platforms.instagram).toBe(1);
  });
});

describe('trackGeneration', () => {
  it('increments total count', () => {
    trackGeneration('instagram', 'Profesional', 'Producto', false);
    trackGeneration('twitter', 'Urgente', 'Servicio', true);
    const stats = loadStats();
    expect(stats.total).toBe(2);
  });

  it('tracks platform usage', () => {
    trackGeneration('instagram', 'Profesional', 'Producto', false);
    trackGeneration('instagram', 'Urgente', 'Oferta', false);
    const stats = loadStats();
    expect(stats.platforms.instagram).toBe(2);
  });

  it('tracks AI vs template usage', () => {
    trackGeneration('instagram', 'Profesional', 'Producto', true);
    trackGeneration('twitter', 'Urgente', 'Servicio', false);
    const stats = loadStats();
    expect(stats.ai).toBe(1);
    expect(stats.template).toBe(1);
  });

  it('tracks tone usage', () => {
    trackGeneration('instagram', 'Profesional', 'Producto', false);
    trackGeneration('instagram', 'Profesional', 'Servicio', false);
    const stats = loadStats();
    expect(stats.tones.Profesional).toBe(2);
  });

  it('tracks format usage', () => {
    trackGeneration('instagram', 'Profesional', 'Producto', false);
    const stats = loadStats();
    expect(stats.formats.Producto).toBe(1);
  });
});

describe('topEntry', () => {
  it('returns the key with the highest value', () => {
    expect(topEntry({ a: 3, b: 7, c: 1 })).toBe('b');
  });

  it('returns "-" for empty object', () => {
    expect(topEntry({})).toBe('-');
  });

  it('returns "-" for null/undefined', () => {
    expect(topEntry(null)).toBe('-');
    expect(topEntry(undefined)).toBe('-');
  });
});
