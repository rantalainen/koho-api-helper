import { KohoApiHelper } from '../index';
import { Methods } from '../methods';
import { CustomReport } from '../resources/custom-report.resource';

export class CustomReportMethods extends Methods {
  constructor(helper: KohoApiHelper) {
    super(helper, 'report/custom', CustomReport);
  }

  /**
   * Suggested `params`:
   * @param settings.term_start date starting from (YYYY-MM-DD)
   * @param settings.term_end date ending to YYYY-MM-DD
   */

  async getById(id: number, params?: { settings?: { term_start?: string; term_end?: string }; [propName: string]: any }): Promise<any> {
    const constructedParams: { [propName: string]: string | number | undefined } = {};

    if (params?.settings) {
      for (const [key, value] of Object.entries(params.settings)) {
        constructedParams[`settings[${key}]`] = value;
      }
    }
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (key == 'settings') {
          continue;
        } else {
          constructedParams[key] = value;
        }
      }
    }

    if (!params?.format || params?.format === 'json') {
      return await this.request(`${this._uri}/${id}`, 'GET', null, constructedParams);
    } else {
      return await this.requestText(`${this._uri}/${id}`, 'GET', null, constructedParams);
    }
  }
}
