import { Message } from "../../lib";
import { Command, data } from "../structs/Command";
import ms from 'ms';

@data({
  name: 'ban',
  description: "Ban a user.",
  args: 'ban <username> [duration] <reason>',
  aliases: ['suspend', 'terminate'],
  admin: true,
  clientAdmin: true
})
export default class BanCommand extends Command {
  async run(message: Message, args: string[]) {
    if (args.length === 0) throw 'Missing arguments **user** and **reason**.';
    if (args.length === 1) throw 'Missing argument **reason**.';

    const username = args[0];
    const duration = args[1] ? ms(args[1]) : NaN;

    if (duration) {
      args.shift();
      if (duration < 1000) throw 'The duration cannot be less than 1 second.'; 
    }

    const reason = args.slice(1).join(' ');
    if (!reason) throw 'Missing argument **reason**.';

    const user = this.client.users.cache.find(u => u.username === username);
    if (!user) throw 'No user with that username exists.';
    if (user.admin) throw 'You cannot ban an admin.';

    await user.ban(reason, duration);

    return this.client.messages.send(`**${username}** has been banned.`);
  }
}