// eslint-disable-next-line import/no-cycle
import { IPlugin } from 'src/sections/organizations/table-row';

export interface IOrganization {
  plugins?: IPlugin[];
  _id?: string;
  name: string;
  logoUrl?: string;
  users: Array<string>;
}
