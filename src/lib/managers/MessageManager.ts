import { Collection } from '@discordjs/collection';
import { MessageFetchOptions } from '../types';
import { Client } from '../Client';
import { ClientError } from '../structures/ClientError';
import { Message } from '../structures/Message';
import { HttpStatusCodes, rateLimitDuration } from '../constants';

export class MessageManager {
  public client: Client;
  public cache = new Collection<string, Message>();
  private rateLimitedUntil = 0;

  constructor(client: Client) {
    this.client = client;
  }

  async fetch(options?: Partial<MessageFetchOptions>) {
    const messages = await this.client.api.get(
      `/messages?${options?.before ? `before=${options.before}&` : ''}${options?.after ? `after=${options.after}` : ''}`
    );
    if (messages.error) throw new ClientError('Failed to fetch messages.', messages);

    for (const message of messages) {
      const msg = new Message(this.client, message);
      this.cache.set(msg.id, msg);
    }

    return messages as Message[];
  }

  async delete(id: string) {
    const req = await this.client.api.delete(`/messages/${id}`);
    if (req.error) throw new ClientError('Failed to delete message.', req);
  }

  async edit(id: string, content: string) {
    const req = await this.client.api.patch(`/messages/${id}`, {
      content
    });

    if (req.error) throw new ClientError('Failed to edit message.', req);

    return new Message(this.client, req);
  }

  async send(content: string): Promise<Message> {
    const date = Date.now();

    if (this.rateLimitedUntil > date) {
      return new Promise(resolve => setTimeout(async () => { 
        resolve(await this.send(content))
       }, this.rateLimitedUntil - date));
    }

    const req = await this.client.api.post(`/messages`, {
      content
    });

    if (req.status === HttpStatusCodes.RateLimited) {
      this.rateLimitedUntil = date + rateLimitDuration;
      return this.send(content);
    }
    if (req.error) throw new ClientError('Failed to send message.', req);

    return new Message(this.client, req);
  }
}