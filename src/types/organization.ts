// eslint-disable-next-line import/no-cycle
export interface IPlugin {
  _id: string;
  name: string;
  type: string;
  isActivated: boolean;
}
export interface IOrganization {
  plugins?: IPlugin[];
  _id?: string;
  name: string;
  logoUrl?: string;
  users: Array<string>;
}
