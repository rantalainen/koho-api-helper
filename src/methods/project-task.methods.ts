import { openStdin } from 'process';
import { KohoApiHelper } from '../index';
import { Methods } from '../methods';
import { ProjectTask, ProjectTaskProperties } from '../resources/project-task.resource';
import { format } from 'path';

export class ProjectTaskMethods extends Methods {
  constructor(helper: KohoApiHelper) {
    super(helper, 'project_tasks', ProjectTask);
  }

  /**
   * Suggested `params`:
   * @param offset Get results starting from this position
   * @param limit to limit the results
   */
  async getAll(params: object = {}): Promise<ProjectTask[]> {
    return await super.getAll(params);
  }

  async getById(id: number): Promise<ProjectTask> {
    return await super.getById(id);
  }

  async export(params: object = {}): Promise<ProjectTaskProperties[]> {
    const result = await this.request(`${this._uri}/export`, 'GET', null, { ...params, format: 'json' });

    return this.parseArrayToProjectTasks(result);
  }

  private parseArrayToProjectTasks(data: any[][]): ProjectTaskProperties[] {
    // Raw export data headers are in the first array
    const headers: string[] = data[0];

    // Parse data to ProjectTaskProperties[]
    const tasks: ProjectTaskProperties[] = [];
    for (const item of data) {
      // Skip headers
      if (item === headers) continue;

      const obj: Record<string, any> = {};
      for (const [index, header] of headers.entries()) {
        obj[header] = item[index];
      }
      const task: ProjectTaskProperties = {
        id: obj['project_tasks.id'],
        name: obj['project_tasks.name'],
        description: obj['project_tasks.description'],
        hidden: !!obj['project_tasks.hidden'],
        customer_id: obj['customers.id'],
        customer_name: obj['customers.name'],
        project_id: obj['projects.id'],
        project_name: obj['projects.name'],
        template_id: obj['project_task_templates.id'],
        invoicing_type: obj['project_tasks.invoicing_type']
      };

      tasks.push(task);
    }

    return tasks;
  }
}
