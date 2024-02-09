export interface IAPIKeys {
  _id: string;
  key: string;
  organization: string;
}

export interface IAPIKeysRemove {
  apiKeyId: string;
}

export interface IAPIKeysCreate {
  organization: string;
  systemKey: boolean;
}
