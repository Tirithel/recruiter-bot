import { Client } from "discord.js";
import { Handler } from "../infra/Handler";
import { DomainInteractionClient } from "../client/DomainInteractionClient";
import { EventName } from "../constants/eventnames";
import { GuildEvent } from "../domain/events/GuildEvent";

export class GuildEventHandler extends Handler {
  client: Client;
  domainClient: DomainInteractionClient;

  constructor(client: Client, domainClient: DomainInteractionClient) {
    super();
    this.client = client;
    this.domainClient = domainClient;
  }

  onEvent(event: GuildEvent): void {
    switch (event.name) {
      case EventName.GUILD_JOIN_EVENT:
        this.domainClient.createServer(event.guild.id);
        console.info(
          `[GuildEventHandler]${event.guild.id}: ${event.name} - initialized guild settings.`
        );
        break;
      case EventName.GUILD_UPDATE_WELCOME_POST_EVENT:
        // todo: think about how we can retrieve the old welcome post and either
        //    1) update it or 2) move it to a new location.
        break;
    }
  }
}
