import { Message } from "../../lib";
import { Event } from "../structs/Event";

const prefix = '/';
export default class MessageCreateEvent extends Event {
  constructor() {
    super('messageCreate');
  }

  async run(message: Message) {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(' ');
    const cmd = args.shift();
    if (!cmd) return;

    const command = this.client.commands.get(cmd) ?? this.client.commands.get(this.client.aliases.get(cmd)!);
    if (!command) return;

    if (command.admin && !message.author.admin) return message.reply('You do not have permission to use this command.');
    if (command.clientAdmin && !this.client.user.admin) return message.reply('I do not have permission to run this command.');

    try {
      await command.run(message, args);
    } catch (e) {
      if (typeof e === 'string') return message.reply(e);
      else {
        message.reply('An unexepcted error occoured trying to run this command.');
        console.error(e);
      }
    }
  }
}