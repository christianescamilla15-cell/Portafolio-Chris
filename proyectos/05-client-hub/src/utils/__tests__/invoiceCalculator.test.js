import { describe, it, expect } from 'vitest';
import { fmt, todayStr, calculateInvoiceTotals } from '../invoiceCalculator.js';

describe('fmt', () => {
  it('formats a number as MXN currency', () => {
    const result = fmt(1000);
    expect(result).toContain('1,000');
  });

  it('formats zero', () => {
    const result = fmt(0);
    expect(result).toContain('0');
  });

  it('formats large numbers with commas', () => {
    const result = fmt(1234567);
    expect(result).toContain('1,234,567');
  });

  it('rounds to no decimal places', () => {
    const result = fmt(1234.56);
    // maximumFractionDigits: 0 means no decimals
    expect(result).not.toContain('.56');
  });

  it('formats negative amounts', () => {
    const result = fmt(-5000);
    expect(result).toContain('5,000');
  });
});

describe('todayStr', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const result = todayStr();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns today\'s date', () => {
    const result = todayStr();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    expect(result).toBe(`${year}-${month}-${day}`);
  });
});

describe('calculateInvoiceTotals', () => {
  it('calculates total and pending for mixed invoices', () => {
    const invoices = [
      { id: 'F1', amount: 10000, status: 'Pagada' },
      { id: 'F2', amount: 20000, status: 'Pendiente' },
      { id: 'F3', amount: 5000, status: 'Vencida' },
    ];
    const result = calculateInvoiceTotals(invoices);
    expect(result.total).toBe(35000);
    expect(result.pending).toBe(25000);
  });

  it('returns zeros for empty array', () => {
    const result = calculateInvoiceTotals([]);
    expect(result.total).toBe(0);
    expect(result.pending).toBe(0);
  });

  it('returns zero pending when all paid', () => {
    const invoices = [
      { id: 'F1', amount: 10000, status: 'Pagada' },
      { id: 'F2', amount: 20000, status: 'Pagada' },
    ];
    const result = calculateInvoiceTotals(invoices);
    expect(result.total).toBe(30000);
    expect(result.pending).toBe(0);
  });

  it('treats all non-Pagada as pending', () => {
    const invoices = [
      { id: 'F1', amount: 10000, status: 'Pendiente' },
      { id: 'F2', amount: 20000, status: 'Vencida' },
    ];
    const result = calculateInvoiceTotals(invoices);
    expect(result.pending).toBe(30000);
  });

  it('handles large amounts correctly', () => {
    const invoices = [
      { id: 'F1', amount: 999999999, status: 'Pendiente' },
    ];
    const result = calculateInvoiceTotals(invoices);
    expect(result.total).toBe(999999999);
    expect(result.pending).toBe(999999999);
  });
});
