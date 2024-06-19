import { KohoApiHelper } from '../index';
import { Resource } from '../resource';

export interface WorkSessionProductProperties {
  id?: number;
  name: string;
  count: number;
  product_type_id: number;
  price: number;
  description?: string;
  vat?: number;
  cost?: number;
  code?: string;
  discount_percentage?: number;
  custom_parameters?: any;
  accounting_account_id?: number;
  accounting_target_id?: number;
  accounting_account_number?: string;
  accounting_target_number?: string;
  gross_total?: number;
  total_count?: number;
  net_total?: number;

  [propName: string]: any;
}

export interface WorkSessionProperties {
  id?: number;
  employee_name?: string;
  customer_name?: string;
  start?: string;
  end?: string;
  project_id?: number;
  employee_id?: number;
  created_at?: string;
  updated_at?: string;
  invoice_hours?: number;
  invoice_price_per_hour?: number;
  invoice_new_amount?: number;
  invoice_gross_amount?: number;
  invoice_id?: number; // LaskuID - eli jos tämä tyhjä, ei tuntikirjausta ole laskutettu
  invoice_description?: string;
  task_id?: number;
  date?: string;
  exchange_id?: number;
  confirmed?: number | boolean;
  rate_level_id?: number;
  customer_id?: number;
  contract_id?: number;
  invoice_name?: string;
  invoicing_type?: string; // Invoicable=tuntilaskutettava, included_to_contract=sopimuksen alaista, internal=sisäistä
  cost?: number;
  cost_per_hour?: number;
  approved_by_manager?: boolean;
  accounting_target_id?: number;
  accounting_account_id?: number;
  assignment_id?: number;
  ticket_system_id?: number;
  products?: WorkSessionProductProperties[];

  [propName: string]: any;
}

export class WorkSession extends Resource {
  constructor(properties: WorkSessionProperties, helper: KohoApiHelper) {
    super(properties, helper, 'workSessions');
  }
}
