import { KohoApiHelper } from '..';
import { Resource } from '../resource';

export interface IncidentProperties {
  id?: number;
  // customer_id: number;
  // name: string;
  // description?: string;
  // cause?: string;
  // employee_id?: number;
  // object_type?: string;
  // object_id?: number;
  // company_id?: number;
  // created_at?: string;
  // updated_at?: string;

  [propName: string]: any;
}

export class Incident extends Resource {
  constructor(properties: IncidentProperties, helper: KohoApiHelper) {
    super(properties, helper, 'incidents');
  }
}
