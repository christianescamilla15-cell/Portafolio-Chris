import { describe, it, expect, vi } from 'vitest';
import { timeAgo, generateNotifications } from '../projectUtils.js';

describe('timeAgo', () => {
  it('returns "just now" for < 1 minute ago (es)', () => {
    const ts = Date.now() - 30000; // 30 seconds ago
    expect(timeAgo(ts, 'es')).toBe('hace un momento');
  });

  it('returns "just now" for < 1 minute ago (en)', () => {
    const ts = Date.now() - 30000;
    expect(timeAgo(ts, 'en')).toBe('just now');
  });

  it('returns minutes ago for < 60 minutes (es)', () => {
    const ts = Date.now() - 5 * 60000; // 5 minutes ago
    expect(timeAgo(ts, 'es')).toBe('hace 5 min');
  });

  it('returns minutes ago for < 60 minutes (en)', () => {
    const ts = Date.now() - 5 * 60000;
    expect(timeAgo(ts, 'en')).toBe('5 min ago');
  });

  it('returns hours ago for < 24 hours (es)', () => {
    const ts = Date.now() - 3 * 3600000; // 3 hours ago
    expect(timeAgo(ts, 'es')).toBe('hace 3h');
  });

  it('returns hours ago for < 24 hours (en)', () => {
    const ts = Date.now() - 3 * 3600000;
    expect(timeAgo(ts, 'en')).toBe('3h ago');
  });

  it('returns days ago for >= 24 hours (es)', () => {
    const ts = Date.now() - 2 * 24 * 3600000; // 2 days ago
    expect(timeAgo(ts, 'es')).toBe('hace 2d');
  });

  it('returns days ago for >= 24 hours (en)', () => {
    const ts = Date.now() - 2 * 24 * 3600000;
    expect(timeAgo(ts, 'en')).toBe('2d ago');
  });

  it('returns 1 day for exactly 24 hours', () => {
    const ts = Date.now() - 24 * 3600000;
    expect(timeAgo(ts, 'en')).toBe('1d ago');
  });

  it('defaults to "es" language', () => {
    const ts = Date.now() - 5 * 60000;
    expect(timeAgo(ts)).toBe('hace 5 min');
  });
});

describe('generateNotifications', () => {
  it('returns an array', () => {
    const result = generateNotifications([], [], [], 'es');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns empty for no matching conditions', () => {
    const invoices = [{ id: 'F1', status: 'Pagada' }];
    const tickets = [{ id: 'T1', priority: 'Baja', status: 'Resuelto' }];
    const projects = [{ id: 1, name: 'Test', progress: 50 }];
    const result = generateNotifications(invoices, tickets, projects, 'es');
    expect(result).toHaveLength(0);
  });

  it('generates notification for overdue invoices', () => {
    const invoices = [{ id: 'FAC-001', status: 'Vencida' }];
    const result = generateNotifications(invoices, [], [], 'es');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('overdue');
    expect(result[0].text).toContain('FAC-001');
  });

  it('generates notification for high-priority open tickets', () => {
    const tickets = [{ id: 'TKT-001', priority: 'Alta', status: 'Abierto' }];
    const result = generateNotifications([], tickets, [], 'en');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('ticket');
    expect(result[0].text).toContain('TKT-001');
  });

  it('generates notification for projects near completion (90-99%)', () => {
    const projects = [{ id: 1, name: 'Big Project', progress: 95 }];
    const result = generateNotifications([], [], projects, 'es');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('milestone');
    expect(result[0].text).toContain('Big Project');
  });

  it('does NOT notify for 100% complete projects', () => {
    const projects = [{ id: 1, name: 'Done', progress: 100 }];
    const result = generateNotifications([], [], projects, 'es');
    expect(result).toHaveLength(0);
  });

  it('includes correct id format for notifications', () => {
    const invoices = [{ id: 'FAC-001', status: 'Vencida' }];
    const result = generateNotifications(invoices, [], [], 'es');
    expect(result[0].id).toBe('notif-inv-FAC-001');
    expect(result[0].read).toBe(false);
  });

  it('generates multiple notifications when conditions match', () => {
    const invoices = [{ id: 'F1', status: 'Vencida' }, { id: 'F2', status: 'Vencida' }];
    const tickets = [{ id: 'T1', priority: 'Alta', status: 'Abierto' }];
    const projects = [{ id: 1, name: 'Proj', progress: 92 }];
    const result = generateNotifications(invoices, tickets, projects, 'es');
    expect(result).toHaveLength(4);
  });
});
