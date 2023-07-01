import { Client } from "discord.js";
import { Handler } from "../infra/Handler";
import { LogEvent } from "../domain/events/DomainEvent";

export class PrintHandler extends Handler {
  client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }

  onEvent(event: LogEvent): void {
    if (event.msg) console.info(`[PrintHandler]: ${event.msg}`);
    if (event.event) console.info(event.event);
  }
}
