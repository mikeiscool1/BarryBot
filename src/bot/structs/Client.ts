import { Client as VCClient } from "../../lib";
import { Command } from "./Command";
import { Event } from './Event';
import fs from 'fs';

export class Client extends VCClient {
  public commands = new Map<string, Command>();
  public aliases = new Map<string, string>();

  async loadCommands() {
    const commandFiles = fs.readdirSync('src/bot/commands').map(file => file.slice(0, -3));

    for (const file of commandFiles) {
      const command = (await import(`../commands/${file}`)).default;
      const instance: Command = new command();
      this.commands.set(instance.name, instance);

      for (const alias of instance.aliases)
        this.aliases.set(alias, instance.name);
    }
  }

  async loadEvents() {
    const eventFiles = fs.readdirSync('src/bot/events').map(file => file.slice(0, -3));

    for (const file of eventFiles) {
      const event = (await import(`../events/${file}`)).default;
      const instance: Event = new event();
      this[event.once ? 'once': 'on'](instance.type, (...args: any[]): void => void instance.run(...args));
    }
  }

  override async login(token: string) {
    await this.loadCommands();
    await this.loadEvents();

    return super.login(token);
  }
}