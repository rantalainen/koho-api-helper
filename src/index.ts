import { default as got, OptionsOfUnknownResponseBody } from 'got';
import CacheableLookup from 'cacheable-lookup';
import { CustomerMethods } from './methods/customer.methods';
import { PersonMethods } from './methods/person.methods';
import { InvoiceMethods } from './methods/invoice.methods';
import { ContractMethods } from './methods/contract.methods';
import { EmployeeMethods } from './methods/employee.methods';
import { ProductMethods } from './methods/product.methods';
import { ProjectMethods } from './methods/project.methods';
import { SaleMethods } from './methods/sale.methods';
import { NotificationMethods } from './methods/notification.methods';
import { IncidentMethods } from './methods/incident.methods';
import { CustomerCategoryMethods } from './methods/customer-category.methods';
import { CustomerGroupMethods } from './methods/customer-group.methods';
import { OfferMethods } from './methods/offer.methods';
import { ProductCatalogMethods } from './methods/product-catalog.methods';
import { CustomerFinancialStatementMethods } from './methods/customer-financial-statement.methods';
import { EmployeeTeamMethods } from './methods/employee-team.methods';
import { EmployeeProfileMethods } from './methods/employee-profile.methods';
import { AccountingTargetMethods } from './methods/accounting-target.methods';
import { WorkSessionMethods } from './methods/work-session.methods';
import { WorkSessionAssignmentMethods } from './methods/work-session-assignment.methods';
import { WorkSessionAssignmentTemplateMethods } from './methods/work-session-assignment-template.methods';
import { WorkSessionShiftMethods } from './methods/work-session-shift.methods';
import { WorkSessionShiftTypeMethods } from './methods/work-session-shift-types.method';
import { CustomReportMethods } from './methods/custom-report.methods';
import { CompanyMethods } from './methods/company.methods';
import { AccountingAssignmentMethods } from './methods/accounting-assignment.methods';
import * as https from 'https';
import { ProjectTemplateMethods } from './methods/project-template.methods';
import { DatafileMethods } from './methods/datafile.methods';
import { HttpsAgent } from 'agentkeepalive';

// delay function
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Create global https agent
const httpsAgent = new HttpsAgent();

export interface KohoThrottleOptions {
  maxRetries: number;
  delay: number;
  enabled: boolean;
}

type KohoApiHelperOptions = {
  token: string;
  companyId?: number;
  enterpriseId?: number;
  url?: string;

  /** Request timeout, can be changed before request, defaults to 30000 */
  timeout?: number;

  /** Set to true if keepalive https-agent should be used with http requests to Koho
   * @deprecated since 6.0.0 Keep Alive Agent is enabled by default, use `keepAliveAgent` with `false` value to disable
   */
  useKeepAliveAgent?: boolean;

  /** You can use this property to override got request options */
  overrideGotOptions?: any;

  /** Set to true to disable streaming for GET requests (added in 2.0.0) */
  disableStreaming?: boolean;

  /** Set Koho throttling options, defaults to retry 3 times on throttle with 15000ms delay */
  throttleOptions?: KohoThrottleOptions;

  /** Instance of `https.Agent` or `true` to enable internal Keep Alive Agent, defaults to `true` */
  keepAliveAgent?: boolean | https.Agent;

  /** Instance of `cacheable-lookup` or `true` to enable internal DNS cache, defaults to `true` */
  dnsCache?: boolean | CacheableLookup;
};

export class KohoApiHelper {
  // [propName: string]: any;
  options: KohoApiHelperOptions;

  readonly accountingTargets: AccountingTargetMethods;
  readonly customers: CustomerMethods;
  readonly persons: PersonMethods;
  readonly invoices: InvoiceMethods;
  readonly contracts: ContractMethods;
  readonly employees: EmployeeMethods;
  readonly employeesTeams: EmployeeTeamMethods;
  readonly employeesProfiles: EmployeeProfileMethods;
  readonly products: ProductMethods;
  readonly productsCatalogs: ProductCatalogMethods;
  readonly projects: ProjectMethods;
  readonly sales: SaleMethods;
  readonly notifications: NotificationMethods;
  readonly incidents: IncidentMethods;
  readonly customersCategories: CustomerCategoryMethods;
  readonly customersGroups: CustomerGroupMethods;
  readonly customersFinancialStatements: CustomerFinancialStatementMethods;
  readonly offers: OfferMethods;
  readonly workSessions: WorkSessionMethods;
  readonly workSessionAssignments: WorkSessionAssignmentMethods;
  readonly workSessionAssignmentTemplates: WorkSessionAssignmentTemplateMethods;
  readonly workSessionShifts: WorkSessionShiftMethods;
  readonly workSessionShiftTypes: WorkSessionShiftTypeMethods;
  readonly customReports: CustomReportMethods;
  readonly companies: CompanyMethods;
  readonly accountingAssignments: AccountingAssignmentMethods;
  readonly projectTemplates: ProjectTemplateMethods;
  readonly datafiles: DatafileMethods;

  constructor(options: KohoApiHelperOptions) {
    this.options = options || {};

    if (!this.options.token) {
      throw new Error('No API token specified');
    }

    if (!this.options.companyId && !this.options.enterpriseId) {
      throw new Error('No Company ID or enterpriseId specified');
    }

    if (!this.options.timeout) {
      this.options.timeout = 30000;
    }

    if (!this.options.url) {
      this.options.url = 'https://suite.koho-online.com/api';
    }

    // Use internal keepAliveAgent by default
    if (this.options.keepAliveAgent === true || this.options.keepAliveAgent === undefined) {
      this.options.keepAliveAgent = httpsAgent;
    }

    // Use internal dnsCache by default (falls back to got's dnsCache)
    if (this.options.dnsCache === true || this.options.dnsCache === undefined) {
      this.options.dnsCache = true;
    }

    this.options.throttleOptions = {
      maxRetries: 3,
      delay: 15000,
      enabled: true,

      ...options.throttleOptions
    };

    this.accountingTargets = new AccountingTargetMethods(this);
    this.customers = new CustomerMethods(this);
    this.customersCategories = new CustomerCategoryMethods(this);
    this.customersGroups = new CustomerGroupMethods(this);
    this.persons = new PersonMethods(this);
    this.invoices = new InvoiceMethods(this);
    this.contracts = new ContractMethods(this);
    this.employees = new EmployeeMethods(this);
    this.employeesTeams = new EmployeeTeamMethods(this);
    this.employeesProfiles = new EmployeeProfileMethods(this);
    this.products = new ProductMethods(this);
    this.productsCatalogs = new ProductCatalogMethods(this);
    this.projects = new ProjectMethods(this);
    this.sales = new SaleMethods(this);
    this.notifications = new NotificationMethods(this);
    this.incidents = new IncidentMethods(this);
    this.offers = new OfferMethods(this);
    this.customersFinancialStatements = new CustomerFinancialStatementMethods(this);
    this.workSessions = new WorkSessionMethods(this);
    this.workSessionAssignments = new WorkSessionAssignmentMethods(this);
    this.workSessionAssignmentTemplates = new WorkSessionAssignmentTemplateMethods(this);
    this.workSessionShifts = new WorkSessionShiftMethods(this);
    this.workSessionShiftTypes = new WorkSessionShiftTypeMethods(this);
    this.customReports = new CustomReportMethods(this);
    this.companies = new CompanyMethods(this);
    this.accountingAssignments = new AccountingAssignmentMethods(this);
    this.datafiles = new DatafileMethods(this);

    /** projectTemplates functionality is experimental */
    this.projectTemplates = new ProjectTemplateMethods(this);
  }

  private _setupRequest(url: string, method?: string, data?: any, params?: any, options?: any, disableStreaming?: boolean) {
    if (!url) {
      throw new Error('Missing URL for request');
    }

    const gotOptions: Partial<OptionsOfUnknownResponseBody> = {
      method: method || 'GET',
      searchParams: { ...this._authParams, ...params },
      ...options
    };

    if (gotOptions.method !== 'GET' && !options?.body && !options?.form) {
      gotOptions.json = data;
    }

    if (this.options.keepAliveAgent) {
      gotOptions.agent = { https: this.options.keepAliveAgent as https.Agent };
    }

    if (this.options.dnsCache) {
      gotOptions.dnsCache = this.options.dnsCache;
    }

    if (this.options?.disableStreaming !== true && disableStreaming !== true && gotOptions.method === 'GET') {
      // Using stream=true enables Koho API streaming
      // @ts-ignore:next-line
      gotOptions.searchParams.stream = true;
    }

    // Include token in headers
    gotOptions.headers = gotOptions.headers || {};
    gotOptions.headers.token = this.options.token;

    // Default retry options
    if (!gotOptions.retry) {
      gotOptions.retry = 2;
    }

    // Default timeout options
    if (!gotOptions.timeout) {
      gotOptions.timeout = this.options.timeout;
    }

    return { ...gotOptions, ...this.options.overrideGotOptions };
  }

  async _retryRequestOnThrottle(maxRetries: number, fn: any): Promise<any> {
    const result = await fn();

    if (this.options.throttleOptions?.enabled === true && result.throttle === true && maxRetries > 0) {
      await delay(this.options.throttleOptions.delay);

      return this._retryRequestOnThrottle(maxRetries - 1, fn);
    } else {
      return result;
    }
  }

  async request(url: string, method?: string, data?: any, params?: any, options?: any): Promise<any> {
    const gotOptions = this._setupRequest(url, method, data, params, options);

    const result: any = await this._retryRequestOnThrottle(this.options.throttleOptions?.maxRetries || 0, () =>
      got(url, gotOptions).json()
    );

    if (result?.status === 'error') {
      throw new Error(result.message);
    }

    return result;
  }

  async requestText(url: string, method?: string, data?: any, params?: any, options?: any): Promise<any> {
    const gotOptions = this._setupRequest(url, method, data, params, options);

    return await got(url, gotOptions).text();
  }

  async requestBuffer(url: string, method?: string, data?: any, params?: any, options?: any): Promise<any> {
    const gotOptions = this._setupRequest(url, method, data, params, options, true);

    return await got(url, gotOptions).buffer();
  }

  get _authParams() {
    const params: any = {};

    if (this.options.enterpriseId) {
      params.enterprise_id = this.options.enterpriseId;
    }

    if (this.options.companyId) {
      params.company_id = this.options.companyId;
    }

    return params;
  }
}
