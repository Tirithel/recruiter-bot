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
        this.domainClient.updateServerSettings(event.guild.id, {
          enableWelcomePost: false,
          acceptingApplications: false,
        });
        console.info(`[GuildEventHandler]: ${event.name} - initialized guild settings.`);
    }
  }
}
