import { KohoApiHelper } from '../index';
import { Resource } from '../resource';


export interface ProjectTemplateTaskTemplate {
  id: number;
  name: string;
  hidden: boolean;
  description?: string;
}

export interface ProjectTemplateProperties {
  id?: number;
  name: string;
  description?: string;
  archived?: boolean;
  default?: boolean;
  task_templates: ProjectTemplateTaskTemplate[];

  [propName: string]: any;
}

export class ProjectTemplate extends Resource {
  constructor (properties: ProjectTemplateProperties, helper: KohoApiHelper) {
    super(properties, helper, 'projectTemplates');
  }

  async update (properties: Partial<ProjectTemplateProperties>) : Promise<void> {
    return super.update(properties);
  }
}