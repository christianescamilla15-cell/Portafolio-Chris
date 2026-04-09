/**
 * Salesforce CRM Integration Service
 * Demonstrates: OAuth 2.0 flow, REST API, SOQL queries, CRUD operations
 * Falls back to local mock data when Salesforce is not configured
 */

const SF_CONFIG = {
  loginUrl: 'https://login.salesforce.com',
  apiVersion: 'v59.0',
}

// Salesforce API wrapper
export class SalesforceService {
  constructor(instanceUrl, accessToken) {
    this.instanceUrl = instanceUrl
    this.accessToken = accessToken
    this.baseUrl = `${instanceUrl}/services/data/${SF_CONFIG.apiVersion}`
  }

  async query(soql) {
    const res = await fetch(`${this.baseUrl}/query/?q=${encodeURIComponent(soql)}`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error(`Salesforce query failed: ${res.status}`)
    return res.json()
  }

  // Contacts
  async getContacts(limit = 20) {
    return this.query(`SELECT Id, Name, Email, Phone, Account.Name FROM Contact LIMIT ${limit}`)
  }

  // Opportunities (Projects)
  async getOpportunities(limit = 20) {
    return this.query(`SELECT Id, Name, StageName, Amount, CloseDate, Account.Name FROM Opportunity LIMIT ${limit}`)
  }

  // Accounts (Clients)
  async getAccounts(limit = 20) {
    return this.query(`SELECT Id, Name, Industry, Phone, Website, BillingCity FROM Account LIMIT ${limit}`)
  }

  // Cases (Tickets)
  async getCases(limit = 20) {
    return this.query(`SELECT Id, CaseNumber, Subject, Status, Priority, Contact.Name FROM Case LIMIT ${limit}`)
  }

  // Create record
  async createRecord(sobject, data) {
    const res = await fetch(`${this.baseUrl}/sobjects/${sobject}/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  // Update record
  async updateRecord(sobject, id, data) {
    const res = await fetch(`${this.baseUrl}/sobjects/${sobject}/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.ok
  }
}

// Mock Salesforce data for demo mode
export const MOCK_SF_DATA = {
  contacts: [
    { Id: 'sf-001', Name: 'Maria Garcia', Email: 'maria@empresa.mx', Phone: '55-1234-5678', Account: { Name: 'TechCorp MX' } },
    { Id: 'sf-002', Name: 'Carlos Lopez', Email: 'carlos@startup.io', Phone: '55-8765-4321', Account: { Name: 'StartupIO' } },
    { Id: 'sf-003', Name: 'Ana Martinez', Email: 'ana@retail.com', Phone: '55-2468-1357', Account: { Name: 'Retail Plus' } },
  ],
  opportunities: [
    { Id: 'sf-opp-001', Name: 'Chatbot IA Enterprise', StageName: 'Proposal', Amount: 45000, CloseDate: '2026-04-15', Account: { Name: 'TechCorp MX' } },
    { Id: 'sf-opp-002', Name: 'Dashboard Analytics', StageName: 'Negotiation', Amount: 32000, CloseDate: '2026-05-01', Account: { Name: 'StartupIO' } },
    { Id: 'sf-opp-003', Name: 'E-commerce Platform', StageName: 'Closed Won', Amount: 58000, CloseDate: '2026-03-20', Account: { Name: 'Retail Plus' } },
  ],
  accounts: [
    { Id: 'sf-acc-001', Name: 'TechCorp MX', Industry: 'Technology', Phone: '55-1111-2222', Website: 'techcorp.mx', BillingCity: 'CDMX' },
    { Id: 'sf-acc-002', Name: 'StartupIO', Industry: 'Software', Phone: '55-3333-4444', Website: 'startup.io', BillingCity: 'Monterrey' },
    { Id: 'sf-acc-003', Name: 'Retail Plus', Industry: 'Retail', Phone: '55-5555-6666', Website: 'retailplus.com', BillingCity: 'Guadalajara' },
  ],
  cases: [
    { Id: 'sf-case-001', CaseNumber: '00001234', Subject: 'API Integration Issue', Status: 'Open', Priority: 'High', Contact: { Name: 'Maria Garcia' } },
    { Id: 'sf-case-002', CaseNumber: '00001235', Subject: 'Dashboard Loading Slow', Status: 'In Progress', Priority: 'Medium', Contact: { Name: 'Carlos Lopez' } },
  ],
}

// Demo service that uses mock data
export class DemoSalesforceService {
  async getContacts() { return { records: MOCK_SF_DATA.contacts, totalSize: MOCK_SF_DATA.contacts.length } }
  async getOpportunities() { return { records: MOCK_SF_DATA.opportunities, totalSize: MOCK_SF_DATA.opportunities.length } }
  async getAccounts() { return { records: MOCK_SF_DATA.accounts, totalSize: MOCK_SF_DATA.accounts.length } }
  async getCases() { return { records: MOCK_SF_DATA.cases, totalSize: MOCK_SF_DATA.cases.length } }
  async createRecord(sobject, data) { return { id: `sf-new-${Date.now()}`, success: true } }
  async updateRecord() { return true }
}

// Factory: returns real or demo service
export function getSalesforceService(instanceUrl, accessToken) {
  if (instanceUrl && accessToken) {
    return new SalesforceService(instanceUrl, accessToken)
  }
  return new DemoSalesforceService()
}
