import { User } from "../../lib";
import { Event } from "../structs/Event";

export default class ReadyEvent extends Event {
  constructor() {
    super('ready');
  }

  async run(client: User) {
    console.log(`Logged in as ${client.username}`);
  }
}