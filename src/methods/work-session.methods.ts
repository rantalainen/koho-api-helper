import { KohoApiHelper } from '../index';
import { Methods } from '../methods';
import { WorkSession, WorkSessionProductProperties, WorkSessionProperties } from '../resources/work-session.resource';

export class WorkSessionMethods extends Methods {
  constructor(helper: KohoApiHelper) {
    super(helper, 'work_sessions', WorkSession);
  }

  /**
   * There are a lot of work sessions. It is preferable to define `start_date` and `end_date` in params. They can be specified in any parseable date format (YYYY-MM-DD for example).
   */
  async getAll(params: object = {}): Promise<WorkSession[]> {
    return await super.getAll(params);
  }

  async getById(id: number): Promise<WorkSession> {
    return await super.getById(id);
  }

  async updateById(id: number, properties: Partial<WorkSessionProperties>): Promise<void> {
    return await super.updateById(id, properties);
  }

  async deleteById(id: number): Promise<void> {
    return await super.deleteById(id);
  }

  async export(params: object = {}, excludeProducts: boolean = true): Promise<WorkSessionProperties[]> {
    const result = await this.request(`${this._uri}/export`, 'GET', null, { ...params, format: 'json' });

    // Products need to be fetched separately
    // Skip if excludeProducts is true
    const resultWithProducts = excludeProducts
      ? [[]]
      : // Excluded params from product request to ensure all products are fetched for worksessions
        await this.request(`${this._uri}/export`, 'GET', null, {
          set: 'csv_export_products',
          format: 'json'
        });

    // Combine results to WorksSessionProperties array
    return this.parseArrayToWorkSessions(result, resultWithProducts);
  }

  private parseArrayToWorkSessions(data: any[][], wsWithProducts: any[][]): WorkSessionProperties[] {
    // Parse products dataset for worksessions
    const productsByWsId: Record<string, WorkSessionProductProperties[]> = {};
    // Parse headers from data - headers are in the first element inside an array
    const productsHeaders: string[] = wsWithProducts.shift()![0];

    for (const item of wsWithProducts) {
      const obj: Record<string, any> = {};
      for (const [index, header] of productsHeaders.entries()) {
        obj[header] = item[index];
      }

      if (!productsByWsId[obj['work_sessions.id']]) {
        productsByWsId[obj['work_sessions.id']] = [];
      }

      productsByWsId[obj['work_sessions.id']].push({
        id: obj['products.id'],
        name: obj['product_types.name'],
        count: obj['products.count'],
        product_type_id: obj['product_types.id'],
        price: obj['products.price'],
        description: obj['products.description'],
        cost: obj['products.cost'],
        code: obj['product_types.code'],
        accounting_target_id: obj['products.accounting_target_id'],
        net_total: obj['products.net_total'],
        worksession_id: obj['work_sessions.id']
      });
    }

    // Parse headers from data - headers are in the first element inside an array
    const headers: string[] = data.shift()![0];
    const worksessions: WorkSessionProperties[] = [];

    // Parse array of arrays into array of objects using first array as headers
    for (const item of data) {
      const obj: Record<string, any> = {};
      for (const [index, header] of headers.entries()) {
        obj[header] = item[index];
      }
      const worksession: WorkSessionProperties = {
        id: obj['work_sessions.id'],
        company_id: obj['work_sessions.company_id'],
        employee_name: obj['employees.name'],
        customer_name: obj['customers.name'],
        description: obj['work_sessions.description'],
        start: obj['work_sessions.start'],
        end: obj['work_sessions.end'],
        project_id: obj['projects.id'],
        project_name: obj['projects.name'],
        employee_id: obj['employees.id'],
        created_at: obj['work_sessions.created_at'],
        updated_at: obj['work_sessions.updated_at'],
        invoice_hours: obj['work_sessions.invoice_hours'],
        hours: obj['work_sessions.hours'],
        invoice_price_per_hour: obj['work_sessions.invoice_price_per_hour'],
        invoice_new_amount: obj['work_sessions.invoice_new_amount'],
        invoice_net_amount: obj['work_sessions.invoice_net_amount'],
        invoice_gross_amount: obj['work_sessions.invoice_gross_amount'],
        invoice_id: obj['invoices.id'],
        invoice_description: obj['work_sessions.invoice_description'],
        task_id: obj['project_tasks.id'],
        task_name: obj['project_tasks.name'],
        date: obj['work_sessions.date'],
        confirmed: !!obj['work_sessions.confirmed'],
        customer_id: obj['customers.id'],
        contract_id: obj['contracts.id'],
        invoice_name: obj['invoices.name'],
        invoicing_type: obj['work_sessions.invoicing_type'],
        cost: obj['work_sessions.cost'],
        cost_per_hour: obj['work_sessions.cost_per_hour'],
        approved_by_manager: !!obj['work_sessions.approved_by_manager'],
        accounting_target_id: obj['work_sessions.accounting_target_id'],
        accounting_target_number: obj['work_sessions.accounting_target_number'],
        accounting_account_id: obj['work_sessions.accounting_account_id'],
        accounting_account_number: obj['work_sessions.accounting_account_number'],
        assignment_id: obj['work_session_assignments.id'],
        products: productsByWsId[obj['work_sessions.id']] || [],
        is_invoice_delegate: obj['work_sessions.is_invoice_delegate'],
        accounting_target_2_id: obj['work_sessions.accounting_target_2_id'],
        accounting_target_3_id: obj['work_sessions.accounting_target_3_id'],
        accounting_target_4_id: obj['work_sessions.accounting_target_4_id']
      };

      worksessions.push(worksession);
    }

    return worksessions;
  }
}
