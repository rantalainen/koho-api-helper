import { default as got } from 'got';

import { CustomerMethods } from './methods/customer.methods';
import { PersonMethods } from './methods/person.methods';
import { InvoiceMethods } from './methods/invoice.methods';
import { ContractMethods } from './methods/contract.methods';
import { EmployeeMethods } from './methods/employee.methods';
import { ProductMethods } from './methods/product.methods';
import { ProjectMethods } from './methods/project.methods';
import { SaleMethods } from './methods/sale.methods';
import { NotificationMethods } from './methods/notification.methods';
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

type KohoApiHelperOptions = {
  token: string;
  companyId?: number;
  enterpriseId?: number;
  url?: string;

  /** Request timeout, can be changed before request, defaults to 30000 */
  timeout?: number;

  /** Set to true if keepalive https-agent should be used with http requests to Koho */
  useKeepAliveAgent?: boolean;

  /** You can use this property to override got request options */
  overrideGotOptions?: any;

  /** Set to true to disable streaming for GET requests (added in 2.0.0) */
  disableStreaming?: boolean;
}

export class KohoApiHelper {
  [propName: string]: any;
  options: any;

  keepAliveAgent: https.Agent = new https.Agent({
    keepAlive: true
  });

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

  constructor(options: KohoApiHelperOptions) {
    this.options = options || {};

    if ( ! this.options.token) {
      throw new Error('No API token specified');
    }

    if ( ! this.options.companyId && ! this.options.enterpriseId) {
      throw new Error('No Company ID or enterpriseId specified');
    }

    if ( ! this.options.timeout) {
      this.options.timeout = 30000;
    }

    if (! this.options.url) {
      this.options.url = 'https://suite.koho-online.com/api';
    }

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

    /** projectTemplates functionality is experimental */
    this.projectTemplates = new ProjectTemplateMethods(this);
  }

  private _setupRequest(url: string, method?: string, data?: any, params?: any, options?: any, disableStreaming?: boolean) {
    if ( ! url) {
      throw new Error('Missing URL for request');
    }

    const gotOptions = {
      method: method || 'GET',
      searchParams: { ...this._authParams, ...params },
      ...options
    }

    if (gotOptions.method !== 'GET' && !options?.body && !options?.form) {
      gotOptions.json = data;
    }

    if (this.options?.useKeepAliveAgent === true) {
      gotOptions.agent = { https: this.keepAliveAgent };
    }

    if (this.options?.disableStreaming !== true && disableStreaming !== true && gotOptions.method === 'GET') {
      // Using stream=true enables Koho API streaming
      gotOptions.searchParams.stream = true;
    }

    // Include token in headers
    gotOptions.headers = gotOptions.headers || {};
    gotOptions.headers.token = this.options.token;

    // Default retry options
    if ( ! gotOptions.retry) {
      gotOptions.retry = 2;
    }

    return { ...gotOptions, ...this.overrideGotOptions };
  }

  async request(url: string, method?: string, data?: any, params?: any, options?: any) : Promise<any> {
    const gotOptions = this._setupRequest(url, method, data, params, options);

    const result: any = await got(url, gotOptions).json();

    if (result?.status === 'error') {
      throw new Error(result.message);
    } 

    return result;
  }

  async requestText(url: string, method?: string, data?: any, params?: any, options?: any) : Promise<any> {
    const gotOptions = this._setupRequest(url, method, data, params, options);

    return await got(url, gotOptions).text();
  }

  async requestBuffer(url: string, method?: string, data?: any, params?: any, options?: any) : Promise<any> {
    const gotOptions = this._setupRequest(url, method, data, params, options, true);

    return await got(url, gotOptions).buffer();
  }

  get _authParams() {
    const params : any = {}

    if (this.options.enterpriseId) {
      params.enterprise_id = this.options.enterpriseId;
    }

    if (this.options.companyId) {
      params.company_id = this.options.companyId;
    }

    return params;
  }
}