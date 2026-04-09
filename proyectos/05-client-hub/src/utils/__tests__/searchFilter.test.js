import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LS_KEYS, lsGet, lsSet } from '../searchFilter.js';

// Create a simple localStorage mock
function createStorageMock() {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
}

const storageMock = createStorageMock();
Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });

describe('LS_KEYS', () => {
  it('has a projects key', () => {
    expect(LS_KEYS.projects).toBe('ch_projects');
  });

  it('has an invoices key', () => {
    expect(LS_KEYS.invoices).toBe('ch_invoices');
  });

  it('has a tickets key', () => {
    expect(LS_KEYS.tickets).toBe('ch_tickets');
  });

  it('has a documents key', () => {
    expect(LS_KEYS.documents).toBe('ch_documents');
  });

  it('has an apiKey key', () => {
    expect(LS_KEYS.apiKey).toBe('ch_claude_key');
  });

  it('has an actions key', () => {
    expect(LS_KEYS.actions).toBe('ch_actions');
  });
});

describe('lsGet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns parsed data from localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify({ name: 'test' }));
    expect(lsGet('testKey', null)).toEqual({ name: 'test' });
  });

  it('returns fallback when key does not exist', () => {
    expect(lsGet('missingKey', 'default')).toBe('default');
  });

  it('returns fallback when stored value is invalid JSON', () => {
    localStorage.setItem('badKey', 'not json{');
    expect(lsGet('badKey', [])).toEqual([]);
  });

  it('returns an array stored in localStorage', () => {
    localStorage.setItem('arr', JSON.stringify([1, 2, 3]));
    expect(lsGet('arr', [])).toEqual([1, 2, 3]);
  });
});

describe('lsSet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores data in localStorage', () => {
    lsSet('myKey', { a: 1 });
    expect(JSON.parse(localStorage.getItem('myKey'))).toEqual({ a: 1 });
  });

  it('stores an array', () => {
    lsSet('arr', [1, 2, 3]);
    expect(JSON.parse(localStorage.getItem('arr'))).toEqual([1, 2, 3]);
  });

  it('overwrites existing data', () => {
    lsSet('key', 'first');
    lsSet('key', 'second');
    expect(JSON.parse(localStorage.getItem('key'))).toBe('second');
  });
});
