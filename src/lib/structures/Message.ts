import { MessageData } from '../types';
import { Client } from '../Client';
import { User } from './User';

export class Message {
  public client: Client;

  public id: string;
  public content: string;
  public author: User;

  constructor(client: Client, message: MessageData) {
    this.client = client;
    this.id = message.id;
    this.content = message.content;
    this.author = this.client.users.cache.get(message.author.id) ?? new User(this.client, message.author);
  }

  public async delete() {
    return this.client.messages.delete(this.id);
  }

  public async edit(content: string) {
    return this.client.messages.edit(this.id, content);
  }

  public async reply(content: string) {
    content = `**${this.author.username}**, ${content}`;
    return this.client.messages.send(content);
  }

  public clone() {
    return new Message(this.client, {
      id: this.id,
      content: this.content,
      author: { id: this.author.id, username: this.author.username, admin: this.author.admin }
    });
  }
}
