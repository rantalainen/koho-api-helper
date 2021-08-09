import { KohoApiHelper } from './index'

export class Methods {
  [x: string]: any;
  _uri: string;
  private _resourceRef: any;

  constructor (helper: KohoApiHelper, uri: string, resourceRef: any, typeOverride?: string) {
    if (!helper || typeof helper !== 'object') {
      throw new Error('Incorrect or missing helper in resource initialization');
    }

    if (!uri || typeof uri !== 'string') {
      throw new Error('Incorrect or missing type in resource initialization');
    }

    if (!resourceRef || typeof resourceRef !== 'function') {
      throw new Error('Incorrect or missing ResourceReference in resource initialization');
    }

    this._helper = () => helper;

    // replace double slashes with one slash
    this._uri = uri.replace('//','/');

    // product_type//catalogs = product_type_catalog | work_session/assignments = assignment || contracts = contract
    const type = uri.includes('//') ? uri.replace('//', '_').slice(0, -1) : uri.includes('/') ? uri.substring(uri.indexOf('/') + 1).slice(0, -1) : uri.slice(0, -1);
    this._type = typeOverride ? () => typeOverride : () => type;

    this._resourceRef = resourceRef;
  }

  // Prefix post body with object type and make sure to clean up properties
  _generateProperties(_properties: any) {
    const properties: any = {};
    for (const property in _properties) {
      if (_properties.hasOwnProperty(property) && property !== '_type' && property !== '_helper') {
        properties[property] = _properties[property];
      }
    }

    const object : any = {}; object[this._type()] = properties;

    return object;
  }

  async request(uri: string, method?: string, data?: any, params?: any, options?: any) : Promise<any> {
    return await this._helper().request(`${this._helper().options.url}/${uri}`, method, data, params, options);
  }

  async requestBuffer(uri: string, method?: string, data?: any, params?: any, options?: any) : Promise<Buffer> {
    return await this._helper().requestBuffer(`${this._helper().options.url}/${uri}`, method, data, params, options);
  }

  async create(properties: any, ...args: any) : Promise<any> {
    // may be needed later
    if (typeof this._validateProperties === 'function') {
      this._validateProperties(properties);
    }

    const result = await this.request(this._uri, 'POST', this._generateProperties(properties));

    console.log(result);

    const resultId = result.id;
    const resource = await this.getById(resultId);

    return resource;
  }

  async getAll(params: object = {}) : Promise<any[]> {
    const result = await this.request(this._uri, 'GET', null, params);

    const resources = result.map((r: any) => new this._resourceRef(r, this._helper()));

    return resources;
  }

  async getById(resourceId: number) : Promise<any> {
    const result = await this.request(`${this._uri}/${resourceId}`);

    return new this._resourceRef(result, this._helper());
  }

  async updateById(resourceId: number, properties: any) : Promise<void> {
    if ( ! resourceId) {
      throw new Error(`Cannot update ${this._type()}: No ${this._type()}.id specified`);
    }

    await this.request(`${this._uri}/${resourceId}`, 'PUT', this._generateProperties(properties));

    return;
  }

  async deleteById(resourceId: number) {
    if ( ! resourceId) {
      throw new Error(`Cannot delete ${this._type()}: No ${this._type()}.id specified`);
    }

    await this.request(`${this._uri}/${resourceId}`, 'DELETE');

    return;
  }
}