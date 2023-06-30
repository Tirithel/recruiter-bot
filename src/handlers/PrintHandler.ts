import { Client } from "discord.js";
import { Handler } from "../infra/Handler";
import { DomainEvent } from "../events/DomainEvent";

export class PrintHandler extends Handler {
  client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }

  onEvent(event: DomainEvent): void {
    console.info(`[PrintHandler]: ${event.name} - ${event.msg}`);
    // console.log(event.name);
    // console.log(`logged in as ${this.client.user?.tag}`);
  }
}
