import { Message, User } from "../../lib";
import { Command, data } from "../structs/Command";

const epoch = 1704067200000n;
@data({
  name: 'userinfo',
  description: 'Get information on a user.',
  args: 'userinfo [username]',
  aliases: ['whois', 'ui', 'user']
})
export default class UserinfoCommand extends Command {
  async run(message: Message, args: string[]) {
    const username = args[0];
    let user: User | undefined;

    if (username) user = this.client.users.cache.find(user => user.username === username);
    else user = message.author;

    if (!user) throw 'No user with that username exists.';

    const msFromCreation = BigInt(user.id) >> 22n;
    const date = new Date(Number(epoch + msFromCreation));
    const createdAt = date.toLocaleString(undefined, {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });

    return this.client.messages.send(`Userinfo - **${user.username}**\n**ID:** ${user.id}\n**Created:** ${createdAt} EST`);
  }
}