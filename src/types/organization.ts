// eslint-disable-next-line import/no-cycle
export interface IPlugin {
  _id: string;
  name: string;
  type: string;
  isActivated: boolean;
}
export interface IOrganization {
  _id?: string;
  plugins?: IPlugin[];
  name: string;
  logoUrl?: string;
  users: Array<string>;
}
