export interface IUsedTokens {
  input: number;
  output: number;
  total: number;
}

export interface IAction {
  type: string;
  date: Date;
  input: any;
  docId: string;
}

export interface ILLMOutput {
  name: string;
  output: string;
  usedTokens: IUsedTokens;
  responseTime: number;
  actions: IAction[];
}

export interface IMessage {
  _id: string;
  organization: string;
  conversation: string;
  contact: {
    name: string;
    email: string;
    avatarUrl: string;
    phoneNumber: string;
    _id: string;
  };
  createdAt: Date;
  input: string;
  llmOutput: ILLMOutput[];
}
