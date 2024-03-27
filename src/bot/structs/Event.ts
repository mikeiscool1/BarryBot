import { EmitterEvents } from "../../lib/types";
import client from "../client";

export abstract class Event {
  public type: keyof EmitterEvents;
  public client = client;

  constructor(type: keyof EmitterEvents) {
    this.type = type;
  }

  abstract run(...args: any[]): unknown;
}