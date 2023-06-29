import { Client } from "discord.js";
import { ReadyEvent } from "../events/ReadyEvent";
import { Handler } from "../infra/Handler";

export class PrintHandler extends Handler {
  client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }

  onEvent(event: ReadyEvent): void {
    console.log(event);
    console.log(`logged in as ${this.client.user?.tag}`);
  }
}
