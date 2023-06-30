import { Client, InteractionType } from "discord.js";
import { Handler } from "../infra/Handler";
import { DomainInteractionClient } from "../client/DomainInteractionClient";
import { EventName } from "../constants/eventnames";
import { InteractionEvent } from "../domain/events/InteractionEvent";
import { LogEvent } from "../domain/events/DomainEvent";
import { EventBus } from "../infra/EventBus";
import { ServerSettings } from "../domain/ServerSettings";

export class InteractionEventHandler extends Handler {
  client: Client;
  eventBus: EventBus;
  domainClient: DomainInteractionClient;

  constructor(client: Client, eventBus: EventBus, domainClient: DomainInteractionClient) {
    super();
    this.client = client;
    this.eventBus = eventBus;
    this.domainClient = domainClient;
  }

  async onEvent(event: InteractionEvent): Promise<void> {
    switch (event.name) {
      case EventName.SLASH_APPLY_EVENT:
        await slashApply(event, this.eventBus, this.domainClient);
        break;
    }
  }
}

async function slashApply(
  event: InteractionEvent,
  eventBus: EventBus,
  domainClient: DomainInteractionClient
) {
  if (
    !event.interaction.guildId ||
    event.interaction.type === InteractionType.ApplicationCommandAutocomplete
  ) {
    eventBus.publish(
      new LogEvent(
        `[InteractionEventHandler]@${event.interaction.guildId}: ${event.name} - in weird state`
      )
    );
    return;
  }

  const serverSettings: ServerSettings = await domainClient.getServerSettings(
    event.interaction.guildId
  );

  eventBus.publish(
    new LogEvent(
      `[InteractionEventHandler]@${event.interaction.guildId}: ${event.name
      } - ${serverSettings.toString()}`
    )
  );

  if (serverSettings.enableWelcomePost && serverSettings.welcomePost) {
  } else {
    await event.interaction.reply({
      content: "guild hasn't set up their welcome post yet",
      ephemeral: true,
    });
  }
}
