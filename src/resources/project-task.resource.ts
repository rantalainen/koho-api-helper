import { KohoApiHelper } from '../index';
import { Resource } from '../resource';

export interface ProjectTaskProperties {
  id?: number;
  name: string;
  description: null;
  hidden: boolean;
  customer_id: number;
  customer_name: string;
  project_id: number;
  project_name: string;
  template_id: number | null;
  invoicing_type: string;

  [propName: string]: any;
}

export class ProjectTask extends Resource {
  constructor(properties: ProjectTaskProperties, helper: KohoApiHelper) {
    super(properties, helper, 'project_tasks');
  }
}
