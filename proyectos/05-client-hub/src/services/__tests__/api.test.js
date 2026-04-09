import { describe, it, expect } from 'vitest';
import { getDemoAssistantResponse, getSuggestionChips } from '../api.js';
import { INITIAL_PROJECTS, INITIAL_INVOICES, INITIAL_TICKETS, INITIAL_DOCUMENTS } from '../../constants/mockData.js';

const projects = INITIAL_PROJECTS;
const invoices = INITIAL_INVOICES;
const tickets = INITIAL_TICKETS;
const documents = INITIAL_DOCUMENTS;
const actions = [];

describe('getDemoAssistantResponse', () => {
  it('returns a string', () => {
    const result = getDemoAssistantResponse('hola', projects, invoices, tickets, documents, actions, 'es');
    expect(typeof result).toBe('string');
  });

  it('responds to greetings in Spanish', () => {
    const result = getDemoAssistantResponse('hola', projects, invoices, tickets, documents, actions, 'es');
    expect(result).toContain('Hola');
  });

  it('responds to greetings in English', () => {
    const result = getDemoAssistantResponse('hello', projects, invoices, tickets, documents, actions, 'en');
    expect(result).toContain('Hi');
  });

  it('responds to project queries', () => {
    const result = getDemoAssistantResponse('estado de mis proyectos', projects, invoices, tickets, documents, actions, 'es');
    expect(result).toContain('proyectos activos');
  });

  it('responds to invoice queries in Spanish', () => {
    const result = getDemoAssistantResponse('facturas pendientes', projects, invoices, tickets, documents, actions, 'es');
    expect(result).toContain('facturas pendientes');
  });

  it('responds to ticket queries in English', () => {
    const result = getDemoAssistantResponse('open tickets', projects, invoices, tickets, documents, actions, 'en');
    expect(result).toContain('active tickets');
  });

  it('responds to document queries', () => {
    const result = getDemoAssistantResponse('mis documentos', projects, invoices, tickets, documents, actions, 'es');
    expect(result).toContain('documentos');
  });

  it('responds to budget queries', () => {
    const result = getDemoAssistantResponse('presupuesto', projects, invoices, tickets, documents, actions, 'es');
    expect(result).toContain('Presupuesto total');
  });

  it('responds to help queries', () => {
    const result = getDemoAssistantResponse('ayuda', projects, invoices, tickets, documents, actions, 'es');
    expect(result).toContain('Puedo ayudarte');
  });

  it('returns a fallback response for unknown queries', () => {
    const result = getDemoAssistantResponse('xyzabc', projects, invoices, tickets, documents, actions, 'es');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('mentions specific project when asked about CRM', () => {
    const result = getDemoAssistantResponse('proyecto CRM', projects, invoices, tickets, documents, actions, 'es');
    expect(result).toContain('CRM');
  });

  it('handles recent action context', () => {
    const result = getDemoAssistantResponse('lo ultimo que hice', projects, invoices, tickets, documents, [], 'es');
    expect(result).toContain('No he registrado');
  });

  it('returns last action when available', () => {
    const result = getDemoAssistantResponse('que hice reciente', projects, invoices, tickets, documents, ['Pago factura'], 'es');
    expect(result).toContain('Pago factura');
  });
});

describe('getSuggestionChips', () => {
  it('returns an array', () => {
    const chips = getSuggestionChips('es');
    expect(Array.isArray(chips)).toBe(true);
  });

  it('returns 4 chips', () => {
    expect(getSuggestionChips('es')).toHaveLength(4);
  });

  it('returns Spanish chips', () => {
    const chips = getSuggestionChips('es');
    expect(chips).toContain('Estado de mis proyectos');
    expect(chips).toContain('Facturas pendientes');
  });

  it('returns English chips', () => {
    const chips = getSuggestionChips('en');
    expect(chips).toContain('My project status');
    expect(chips).toContain('Pending invoices');
  });

  it('chips are all strings', () => {
    const chips = getSuggestionChips('es');
    chips.forEach(chip => expect(typeof chip).toBe('string'));
  });
});
