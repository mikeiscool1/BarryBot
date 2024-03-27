import { EventEmitter } from 'stream';
import { User } from './structures/User';
import { WebSocketManager } from './managers/WebSocketManager';
import { EmitterEvents } from './types';
import { API } from './API';
import { MessageManager } from './managers/MessageManager';
import { UserManager } from './managers/UserManager';

export class Client extends EventEmitter {
  token: string = null!;
  ws: WebSocketManager = null!;
  ready: boolean = false;

  api = new API(this);
  user: User = null!;
  messages = new MessageManager(this);
  users = new UserManager(this);

  constructor() {
    super();
  }

  login(token: string) {
    this.token = token;

    this.ws = new WebSocketManager(this);
    this.ws.connect();
  }

  override on<T extends keyof EmitterEvents>(event: T, listener: EmitterEvents[T]) {
    return super.on(event, listener);
  }

  override once<T extends keyof EmitterEvents>(event: T, listener: EmitterEvents[T]) {
    return super.once(event, listener);
  }

  override emit<T extends keyof EmitterEvents>(event: T, ...args: Parameters<EmitterEvents[T]>) {
    return super.emit(event, ...args);
  }
}
