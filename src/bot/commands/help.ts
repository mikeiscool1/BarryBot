import { Message } from "../../lib";
import { Command, data } from "../structs/Command";

@data({
  name: 'help',
  description: 'View all commands or get help on a command.',
  args: 'help [command]'
})
export default class HelpCommand extends Command {
  async run(message: Message, args: string[]) {
    const cmd = args[0];

    if (!cmd) return this.client.messages.send(`**COMMANDS** - BarryBot\n${[...this.client.commands.keys()].join(', ')}`);

    const command = this.client.commands.get(cmd) ?? this.client.commands.get(this.client.aliases.get(cmd)!);
    if (!command) throw 'Command not found.';

    return this.client.messages.send(`**/${command.name}**\n${command.description}`);
  }
}