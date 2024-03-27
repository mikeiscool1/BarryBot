import { Message } from "../../lib";
import client from "../client";
import { CommandData } from "../types";

export abstract class Command {
  public client = client;

  public name: string = null!;
  public description: string = null!;
  public args: string = null!;
  public aliases: string[] = [];
  public admin: boolean = false;
  public clientAdmin: boolean = false;
  
  abstract run(message: Message, args: string[]): unknown;
}

export function data(data: CommandData) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      name = data.name;
      description = data.description;
      args = data.args;
      aliases = data.aliases ?? [];
      admin = data.admin ?? false;
      clientAdmin = data.clientAdmin ?? false;
    };
  };
}