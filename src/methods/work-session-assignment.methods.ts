import { KohoApiHelper } from '../index';
import { Methods } from '../methods';
import {
  WorkSessionAssignment,
  WorkSessionAssignmentProperties,
  WorkSessionAssignmentRequirementProperties
} from '../resources/work-session-assignment.resource';

export class WorkSessionAssignmentMethods extends Methods {
  constructor(helper: KohoApiHelper) {
    super(helper, 'work_session/assignments', WorkSessionAssignment);
  }

  /**
   * Suggested `params`:
   * @param start_date Assignment date starting from (YYYY-MM-DD)
   * @param end_date Assignment date ending by (YYYY-MM-DD)
   * @param plan true to only show project plans (projektisuunnitelma)
   * @param no_plan true to only show assignments (työmääräys)
   * @param updated_after Get objects updated after YYYY-MM-DD
   * @param confirmed true to only show confirmed assignments
   * @param unconfirmed true to only show unconfirmed assignments
   * @param offset Get results starting from this position
   * @param limit to limit the results
   */
  async getAll(params: object = {}): Promise<WorkSessionAssignment[]> {
    return await super.getAll(params);
  }

  async getById(id: number): Promise<WorkSessionAssignment> {
    return await super.getById(id);
  }

  async updateById(id: number, properties: Partial<WorkSessionAssignmentProperties>): Promise<void> {
    return await super.updateById(id, properties);
  }

  async deleteById(id: number): Promise<void> {
    return await super.deleteById(id);
  }

  async export(params: object = {}): Promise<WorkSessionAssignmentProperties[]> {
    const result = await this.request(`${this._uri}/export`, 'GET', null, { ...params, format: 'json' });

    // Requirements need to be fetched separately
    // Excluded params from requirements request to ensure all requirements are fetched for worksession assignments
    const resultWithRequirements = await this.request(`${this._uri}/export`, 'GET', null, {
      ...params,
      set: 'csv_export_requirements',
      format: 'json'
    });

    // Combine results to WorksSessionAssignmentRequirements array
    return this.parseArrayToWorkSessionAssignmentRequirements(result, resultWithRequirements);
  }

  private parseArrayToWorkSessionAssignmentRequirements(data: any[][], resultWithRequirements: any[][]): WorkSessionAssignmentProperties[] {
    // Parse requirements dataset for worksessions
    const requirementsByWsaId: Record<string, WorkSessionAssignmentRequirementProperties[]> = {};
    // Parse headers from data - headers are in the first element inside an array
    const requirementsHeaders: string[] = resultWithRequirements.shift()!;

    for (const item of resultWithRequirements) {
      const obj: Record<string, any> = {};
      for (const [index, header] of requirementsHeaders.entries()) {
        obj[header] = item[index];
      }

      if (!requirementsByWsaId[obj['work_session_assignments.id']]) {
        requirementsByWsaId[obj['work_session_assignments.id']] = [];
      }

      requirementsByWsaId[obj['work_session_assignments.id']].push({
        id: obj['work_session_assignment_requirements.id'],
        name: obj['work_session_assignment_requirements.name'],
        description: obj['work_session_assignment_requirements.description'],
        completed_at: obj['work_session_assignment_requirements.completed_at'],
        date: obj['work_session_assignment_requirements.date'],
        assignment_id: obj['work_session_assignments.id']
      });
    }

    // Parse headers from data - headers are in the first element inside an array
    const headers: string[] = data.shift()!;
    const worksessionAssignments: WorkSessionAssignmentProperties[] = [];

    // Parse array of arrays into array of objects using first array as headers
    for (const item of data) {
      const obj: Record<string, any> = {};
      for (const [index, header] of headers.entries()) {
        obj[header] = item[index];
      }
      const wsa: WorkSessionAssignmentProperties = {
        id: obj['work_session_assignments.id'],
        name: obj['work_session_assignments.name'],
        sub_suffix: obj['work_session_assignments.sub_suffix'],
        date: obj['work_session_assignments.date'],
        term_start: obj['work_session_assignments.term_start'],
        term_end: obj['work_session_assignments.term_end'],
        confirmed: obj['work_session_assignments.confirmed'],
        description: obj['work_session_assignments.description'],
        project_id: obj['projects.id'],
        task_id: obj['work_session_assignments.task_id'],
        assignment_template_id: obj['work_session_assignment_templates.id'],
        customer_id: obj['customers.id'],
        requirements: requirementsByWsaId[obj['work_session_assignments.id']] || [],
        parent_id: obj['work_session_assignments.parent_id'],
        is_plan: obj['work_session_assignments.is_plan'],
        invoicing_type: obj['work_session_assignments.invoicing_type']
      };

      worksessionAssignments.push(wsa);
    }

    return worksessionAssignments;
  }
}
