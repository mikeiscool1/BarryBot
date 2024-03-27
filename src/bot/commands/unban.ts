import { Message } from "../../lib";
import { Command, data } from "../structs/Command";
import ms from 'ms';

@data({
  name: 'unban',
  description: "Unban an account.",
  args: 'unban <username>',
  aliases: ['activate', 'unsuspend'],
  admin: true,
  clientAdmin: true
})
export default class UnbanCommand extends Command {
  async run(message: Message, args: string[]) {
    if (args.length === 0) throw 'Missing arguments **user**.';

    const username = args[0];
    const user = this.client.users.cache.find(u => u.username === username);
    if (!user) throw 'No user with that username exists.';

    await user.activate();

    return this.client.messages.send(`**${username}** has been unbanned.`);
  }
}