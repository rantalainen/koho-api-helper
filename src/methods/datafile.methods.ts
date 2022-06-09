import { KohoApiHelper } from '../index';
import { Methods } from '../methods';
import { Datafile, DatafileProperties } from '../resources/datafile.resource';

export class DatafileMethods extends Methods {
  constructor(helper: KohoApiHelper) {
    super(helper, 'datafiles', Datafile);
  }

  async getAll(params: object = {}): Promise<Datafile[]> {
    return await super.getAll(params);
  }

  async getById(id: number): Promise<Datafile> {
    return await super.getById(id);
  }

  async updateById(id: number, properties: Partial<DatafileProperties>): Promise<void> {
    return await super.updateById(id, properties);
  }

  async deleteById(id: number): Promise<void> {
    return await super.deleteById(id);
  }
}
