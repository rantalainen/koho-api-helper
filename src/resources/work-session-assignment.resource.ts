import { KohoApiHelper } from '../index';
import { Resource } from '../resource';

export interface WorkSessionAssignmentRequirementProperties {
  id?: number;
  name: string;
  description?: string;
  completed_at?: string;
  date: string;
  assignment_id?: number;
}

export interface WorkSessionAssignmentProperties {
  id?: number;
  name: string;
  date: string;
  confirmed?: boolean;
  description?: string;
  project_id: number;
  task_id: number;
  assignment_template_id?: number;
  customer_id: number;
  requirements: WorkSessionAssignmentRequirementProperties[];
  parent_id?: number;
  is_plan?: boolean;
  invoicing_type?: string; // PROJEKTISUUNNITELMA: Laskutustapa, täytetty vain jos vaiheella pakotettu. invoicable: Laskutettava, included_to_contract: Sopimuksen alainen, internal: Sisäinen

  [propName: string]: any;
}

export class WorkSessionAssignment extends Resource {
  constructor(properties: WorkSessionAssignmentProperties, helper: KohoApiHelper) {
    super(properties, helper, 'workSessionAssignment');
  }
}
