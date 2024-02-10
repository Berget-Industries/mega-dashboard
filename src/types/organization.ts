// eslint-disable-next-line import/no-cycle
export interface IPlugin {
  _id: string;
  name: string;
  type: string;
  isActivated: boolean;
  config: Record<string, any>;
  organization: string;
}
export interface IOrganization {
  _id?: string;
  plugins?: IPlugin[];
  name: string;
  logoUrl?: string;
  users: Array<string>;
}
