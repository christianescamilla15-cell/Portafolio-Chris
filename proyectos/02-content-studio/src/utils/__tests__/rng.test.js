import { describe, it, expect } from 'vitest';
import { createRng, hashString, pickRandom, shuffled } from '../rng.js';

describe('createRng', () => {
  it('returns consistent values for the same seed', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(99);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).not.toEqual(seq2);
  });

  it('returns values between 0 and 1', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });
});

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const rng = createRng(42);
    const arr = ['a', 'b', 'c', 'd'];
    const result = pickRandom(arr, rng);
    expect(arr).toContain(result);
  });

  it('returns undefined for an empty array', () => {
    const rng = createRng(42);
    const result = pickRandom([], rng);
    expect(result).toBeUndefined();
  });

  it('returns the only element for a single-element array', () => {
    const rng = createRng(42);
    expect(pickRandom(['only'], rng)).toBe('only');
  });
});

describe('shuffled', () => {
  it('returns all elements from the original array', () => {
    const rng = createRng(42);
    const arr = [1, 2, 3, 4, 5];
    const result = shuffled(arr, rng);
    expect(result).toHaveLength(arr.length);
    expect(result.sort()).toEqual([...arr].sort());
  });

  it('does not mutate the original array', () => {
    const rng = createRng(42);
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffled(arr, rng);
    expect(arr).toEqual(original);
  });

  it('produces a consistent shuffle for the same seed', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result1 = shuffled(arr, createRng(42));
    const result2 = shuffled(arr, createRng(42));
    expect(result1).toEqual(result2);
  });
});

describe('hashString', () => {
  it('produces consistent output for the same input', () => {
    expect(hashString('hello')).toBe(hashString('hello'));
  });

  it('produces different hashes for different strings', () => {
    expect(hashString('hello')).not.toBe(hashString('world'));
  });

  it('returns a non-negative number', () => {
    expect(hashString('test')).toBeGreaterThanOrEqual(0);
  });

  it('handles empty string', () => {
    expect(hashString('')).toBe(0);
  });
});
