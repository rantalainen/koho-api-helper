import { KohoApiHelper } from '../index';
import { Methods } from '../methods';
import { Incident, IncidentProperties } from '../resources/incident.resource';

export class IncidentMethods extends Methods {
  constructor(helper: KohoApiHelper) {
    super(helper, 'incidents', Incident);
  }

  /**
   * Get all customer targeted incidents
   */
  async getAll(params: { [propName: string]: any } = {}): Promise<Incident[]> {
    return await this._helper().request(`${this._helper().options.url}/customers/incidents`, 'GET');
  }

  /**
   * Create customer targeted incidents
   */
  async create(customerId: number, incident: any): Promise<void> {
    return await this._helper().request(
      `${this._helper().options.url}/customers/${customerId}/incidents`,
      'POST',
      this._generateProperties(incident)
    );
  }
}
