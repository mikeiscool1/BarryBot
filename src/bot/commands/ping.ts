import { Command, data } from "../structs/Command";

@data({
  name: 'ping',
  description: "Get the bot's ping.",
  args: 'ping',
  aliases: ['pong']
})
export default class PingCommand extends Command {
  async run() {
    const now = performance.now();
    const msg = await this.client.messages.send('Pinging...');
    const roundtrip = Math.round(performance.now() - now);

    return msg.edit(`Pong! Roundtrip: ${roundtrip}ms | Latency: ${this.client.ws.ping}ms.`);
  }
}