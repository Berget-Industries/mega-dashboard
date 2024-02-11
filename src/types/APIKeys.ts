export interface IAPIKeys {
  _id: string;
  key: string;
  organization: string;
  systemKey: boolean;
}

export interface IAPIKeysRemove {
  apiKeyId: string;
}

export interface IAPIKeysCreate {
  organization: string;
  systemKey: boolean;
}

export interface ISystemAPIKeysCreate {
  organization: string[];
  systemKey: boolean;
}
