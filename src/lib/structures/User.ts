import { UserData } from '../types';
import { Client } from '../Client';

export class User {
  public client: Client;

  public username: string;
  public id: string;
  public admin: boolean;
  public online: boolean;

  constructor(client: Client, user: UserData) {
    this.client = client;
    this.username = user.username;
    this.id = user.id;
    this.admin = user.admin ?? false;
    this.online = user.online ?? false;
  }

  async activate() {
    return this.client.users.activate(this.id);
  }

  async ban(reason: string, duration?: number) {
    return this.client.users.ban(this.id, reason, duration);
  }

  public clone() {
    return new User(this.client, { username: this.username, id: this.id, admin: this.admin, online: this.online });
  }
}
