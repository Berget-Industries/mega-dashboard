import { IMessage } from './message';

export interface IContact {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

export interface IConversation {
  _id: string;
  organization: string;
  contact: IContact;
  messages: IMessage[];
  lastActivity: Date;
}
