import { Collection } from '@discordjs/collection';
import { Client } from '../Client';
import { ClientError } from '../structures/ClientError';
import { User } from '../structures/User';
import { UserState } from '../constants';

export class UserManager {
  public client: Client;
  public cache = new Collection<string, User>();

  constructor(client: Client) {
    this.client = client;
  }

  async fetch(id: string): Promise<User>;
  async fetch(): Promise<User[]>;
  async fetch(id?: string) {
    if (id) {
      const user = this.cache.get(id) ?? (await this.client.api.get(`/users/${id}`));
      if (user.error) throw new ClientError('Failed to fetch user.', user);

      this.cache.set(user.id, user);

      return new User(this.client, user);
    }

    const users = await this.client.api.get('/users');
    if (users.error) throw new ClientError('Failed to fetch users.', users);

    for (const user of users) {
      const usr = new User(this.client, user);
      this.cache.set(user.id, usr);
    }

    return users as User[];
  }

  async activate(id: string) {
    const req = await this.client.api.patch(`/users-admin/${id}`, { state: UserState.Active });
    if (req.error) throw new ClientError('Failed to activate user.', req);

    return new User(this.client, req);
  }

  async ban(id: string, reason: string, duration?: number) {
    const date = new Date(Date.now() + (duration ?? 0)).toISOString();
    const req = await this.client.api.patch(`/users-admin/${id}`, {
      state: UserState.Suspended,
      suspended_reason: reason,
      suspended_until: duration ? date : null
    });
    if (req.error) throw new ClientError('Failed to ban user.', req);

    return new User(this.client, req);
  }
}
