import { KohoApiHelper } from '../index';
import { Resource } from '../resource';

export interface DatafileProperties {
  id: number;
  name: string;
  description?: string;
  folder_id: number;
  data_file_name: string;
  data_content_type: string;
  object_id: number;
  object_type: string;
  company_id?: number;

  [propName: string]: any;
}

export class Datafile extends Resource {
  constructor(properties: DatafileProperties, helper: KohoApiHelper) {
    super(properties, helper, 'datafiles');
  }
}
