export interface IOrganization {
  plugins?: Array<string>;
  _id?: string;
  name: string;
  logoUrl?: string;
  users: Array<string>;
}
