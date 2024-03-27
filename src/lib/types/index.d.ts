import { Message } from '../structures/Message';
import { User } from '../structures/User';
import { Opcodes, EventTypes } from '../constants';

export type Packet = {
  op: Opcodes;
  t?: EventTypes;
  d?: any;
};

export type EmitterEvents = {
  ready: (user: User) => any;
  messageCreate: (message: Message) => any;
  messageEdit: (oldMessage: Message | null, newMessage: Message) => any;
  messageDelete: (message: Message | null) => any;
  presenceUpdate: (user: User) => any;
  typingStart: (user: User) => any;
  userUpdate: (oldUser: User, newUser: User) => any;
  userCreate: (user: User) => any;
  avatarUpdate: (user: User) => any;
};

export interface MessageFetchOptions {
  before: string;
  after: string;
}

export interface MessageData {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    admin: boolean;
  };
}

export interface UserData {
  username: string;
  id: string;
  admin?: boolean;
  online?: boolean;
}
