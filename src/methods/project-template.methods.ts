import { KohoApiHelper } from '../index';
import { Methods } from '../methods';
import { ProjectTemplate, ProjectTemplateProperties } from '../resources/project-template.resource';

export class ProjectTemplateMethods extends Methods {
  constructor (helper: KohoApiHelper) {
    super(helper, 'project/templates', ProjectTemplate, 'project_template');
  }

  async getAll(params: object = {}) : Promise<ProjectTemplate[]> {
    return await super.getAll(params);
  }

  async getById(id: number) : Promise<ProjectTemplate> {
    return await super.getById(id);
  }

  async updateById(id: number, properties: Partial<ProjectTemplateProperties>) : Promise<void> {
    return await super.updateById(id, properties);
  }

  async deleteById(id: number) : Promise<void> {
    return await super.deleteById(id);
  }
}