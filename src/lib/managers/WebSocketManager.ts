import { Client } from '../Client';
import { User } from '../structures/User';
import { Packet } from '../types';
import { ClientEvents, CloseCodes, EventTypes, noReconnectCodes, Opcodes } from '../constants';
import WebSocket from 'ws';
import { Message } from '../structures/Message';

export class WebSocketManager {
  public client: Client = null!;
  private _ws: WebSocket = null!;
  private pingSent = 0;
  public ping = -1;


  constructor(client: Client) {
    this.client = client;
  }

  connect() {
    // Connect to gateway
    this._ws = new WebSocket(process.env.GATEWAY!);

    // send identification
    this._ws.onopen = () => {
      this.send({ op: Opcodes.Identify, d: { authorization: this.client.token } });

      this.startHeartbeat();
    };

    this._ws.onclose = e => {
      if (noReconnectCodes.includes(e.code)) {
        switch (e.code as CloseCodes) {
          case CloseCodes.Forced:
            throw new Error('Connection forcefully closed.');
          case CloseCodes.AuthenticationFailed:
            throw new Error('Authentication failed.');
          default:
            throw new Error(`Connection closed unexpectedly with code ${e.code}`);
        }
      }

      setTimeout(() => {
        this.connect();
      }, 5000);
    };

    this._ws.onmessage = async e => {
      const packet: Packet = JSON.parse(e.data as string);
      if (packet.op === Opcodes.HeartbeatACK) return this.ping = Math.round(performance.now() - this.pingSent);

      return this.handleEvent(packet);
    };
  }

  startHeartbeat() {
    setInterval(() => {
      this.send({ op: Opcodes.Heartbeat });
      this.pingSent = performance.now();
    }, 20000);
  }

  send(data: Packet) {
    this._ws.send(JSON.stringify(data));
  }

  async handleEvent(packet: Packet) {
    switch (packet.t) {
      case EventTypes.Ready:
        this.client.user = new User(this.client, packet.d);
        await this.client.users.fetch();

        this.client.ready = true;
        this.client.emit(ClientEvents.Ready, this.client.user);
        break;
      case EventTypes.MessageCreate: {
        const message = new Message(this.client, packet.d);
        this.client.messages.cache.set(message.id, message);

        this.client.emit(ClientEvents.MessageCreate, message);
        break;
      }
      case EventTypes.MessageEdit: {
        let oldMsg;
        let newMsg;

        const cachedMsg = this.client.messages.cache.get(packet.d.id);
        if (cachedMsg) {
          oldMsg = cachedMsg.clone();
          cachedMsg.content = packet.d.content;
          newMsg = cachedMsg;
        } else {
          oldMsg = null;
          const message = new Message(this.client, packet.d);
          this.client.messages.cache.set(message.id, message);
          newMsg = message;
        }

        this.client.emit(ClientEvents.MessageEdit, oldMsg, newMsg);
        break;
      }
      case EventTypes.MessageDelete: {
        const cachedMsg = this.client.messages.cache.get(packet.d.id) ?? null;
        this.client.emit(ClientEvents.MessageDelete, cachedMsg);

        if (cachedMsg) this.client.messages.cache.delete(cachedMsg.id);
        break;
      }
      case EventTypes.PresenceUpdate: {
        const user = await this.client.users.fetch(packet.d.id)!;
        user.online = packet.d.new_presence === 'ONLINE';

        this.client.emit(ClientEvents.PresenceUpdate, user);
        break;
      }
      case EventTypes.TypingStart: {
        this.client.emit(
          ClientEvents.TypingStart,
          this.client.users.cache.find(user => user.username === packet.d.username)!
        );
        break;
      }
      case EventTypes.UserUpdate: {
        if (packet.d.created) {
          const user = new User(this.client, packet.d);
          return this.client.emit(ClientEvents.UserCreate, user);
        }

        const cachedUser = this.client.users.cache.get(packet.d.id)!;
        const clone = cachedUser.clone();

        if ('username' in packet.d) cachedUser.username = packet.d.username;
        if ('avatar' in packet.d) return this.client.emit(ClientEvents.AvatarUpdate, cachedUser);

        return this.client.emit(ClientEvents.UserUpdate, clone, cachedUser);
      }
    }
  }
}
