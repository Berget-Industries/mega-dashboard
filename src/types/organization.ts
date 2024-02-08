// eslint-disable-next-line import/no-cycle
import { IPlugin } from 'src/sections/organizations/table-row';

export interface IOrganization {
  _id?: string;
  plugins?: IPlugin[];
  name: string;
  logoUrl?: string;
  users: Array<string>;
}
