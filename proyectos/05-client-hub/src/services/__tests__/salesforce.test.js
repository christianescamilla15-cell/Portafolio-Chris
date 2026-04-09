import { describe, it, expect } from 'vitest';
import {
  SalesforceService,
  DemoSalesforceService,
  MOCK_SF_DATA,
  getSalesforceService,
} from '../salesforce.js';

describe('DemoSalesforceService', () => {
  const service = new DemoSalesforceService();

  it('returns mock contacts with correct structure', async () => {
    const result = await service.getContacts();
    expect(result.records).toHaveLength(3);
    expect(result.totalSize).toBe(3);
    expect(result.records[0]).toHaveProperty('Id');
    expect(result.records[0]).toHaveProperty('Name');
    expect(result.records[0]).toHaveProperty('Email');
    expect(result.records[0]).toHaveProperty('Phone');
    expect(result.records[0]).toHaveProperty('Account');
  });

  it('returns mock opportunities with correct structure', async () => {
    const result = await service.getOpportunities();
    expect(result.records).toHaveLength(3);
    expect(result.totalSize).toBe(3);
    expect(result.records[0]).toHaveProperty('StageName');
    expect(result.records[0]).toHaveProperty('Amount');
    expect(result.records[0]).toHaveProperty('CloseDate');
  });

  it('returns mock accounts with correct structure', async () => {
    const result = await service.getAccounts();
    expect(result.records).toHaveLength(3);
    expect(result.records[0]).toHaveProperty('Industry');
    expect(result.records[0]).toHaveProperty('BillingCity');
    expect(result.records[0]).toHaveProperty('Website');
  });

  it('returns mock cases with correct structure', async () => {
    const result = await service.getCases();
    expect(result.records).toHaveLength(2);
    expect(result.records[0]).toHaveProperty('CaseNumber');
    expect(result.records[0]).toHaveProperty('Subject');
    expect(result.records[0]).toHaveProperty('Status');
    expect(result.records[0]).toHaveProperty('Priority');
  });

  it('createRecord returns success', async () => {
    const result = await service.createRecord('Contact', { Name: 'Test' });
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });

  it('updateRecord returns true', async () => {
    const result = await service.updateRecord('Contact', 'sf-001', { Name: 'Updated' });
    expect(result).toBe(true);
  });
});

describe('getSalesforceService', () => {
  it('returns DemoSalesforceService when no credentials provided', () => {
    const service = getSalesforceService(null, null);
    expect(service).toBeInstanceOf(DemoSalesforceService);
  });

  it('returns DemoSalesforceService when only instanceUrl provided', () => {
    const service = getSalesforceService('https://my.salesforce.com', null);
    expect(service).toBeInstanceOf(DemoSalesforceService);
  });

  it('returns SalesforceService when both credentials provided', () => {
    const service = getSalesforceService('https://my.salesforce.com', 'token123');
    expect(service).toBeInstanceOf(SalesforceService);
  });
});

describe('MOCK_SF_DATA', () => {
  it('has all required data categories', () => {
    expect(MOCK_SF_DATA).toHaveProperty('contacts');
    expect(MOCK_SF_DATA).toHaveProperty('opportunities');
    expect(MOCK_SF_DATA).toHaveProperty('accounts');
    expect(MOCK_SF_DATA).toHaveProperty('cases');
  });

  it('contacts have required fields', () => {
    MOCK_SF_DATA.contacts.forEach(c => {
      expect(c.Id).toBeDefined();
      expect(c.Name).toBeDefined();
      expect(c.Email).toBeDefined();
      expect(c.Account.Name).toBeDefined();
    });
  });

  it('opportunities have valid Amount numbers', () => {
    MOCK_SF_DATA.opportunities.forEach(o => {
      expect(typeof o.Amount).toBe('number');
      expect(o.Amount).toBeGreaterThan(0);
    });
  });
});
