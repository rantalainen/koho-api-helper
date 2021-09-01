import { KohoApiHelper } from "..";
import { Resource } from '../resource'; 

export interface ProjectProjectTemplateProperties {
  id: number;
  name?: string;
}

export interface ProjectParticipationProperties {
  id?: number;
  employee_id: number;
  project_id: number;
  start?: string;
  end?: string;
  responsible: boolean;
  load?: number;
}

export interface ProjectProperties {
  id?: number;
  name: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  customer_id?: number;
  active?: boolean;
  description?: string;
  category_id?: number;
  category_name?: string;
  templates?: ProjectProjectTemplateProperties[];
  plan_id?: number;
  participations: ProjectParticipationProperties[];
  price_per_hour?: number;
  external_project_key?: string;
  hours_budget?: number;
  contract_hours?: number;
  budget_total?: number;
  invoiceable_budget?: number;
  net_total_budget?: number;
  custom_parameters?: any;
  accounting_account_number?: string;

  [propName: string]: any;
}

export class Project extends Resource {
  constructor (properties: ProjectProperties, helper: KohoApiHelper) {
    super(properties, helper, 'projects');
  }

  _updateInterceptor(properties: Partial<ProjectProperties>) : void {
    // Rename template_links array for update request (legacy naming?)
    if (properties.template_links && properties.template_links.length) {
      properties.template_links_attributes = properties.template_links;

      delete properties.template_links;
    }

    if (properties.participations) {
      properties.participations_attributes = properties.participations;

      delete properties.participations;
    }
  }

  async archive() : Promise<void> {
    return await super.update({ active : false });
  }

  async activate() : Promise<void> {
    return await super.update({ active : true });
  }

  async update (properties: Partial<ProjectProperties>) : Promise<void> {
    return super.update(properties);
  }
}