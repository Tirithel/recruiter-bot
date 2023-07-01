import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  InteractionType,
} from "discord.js";
import { Handler } from "../infra/Handler";
import { DomainInteractionClient } from "../client/DomainInteractionClient";
import { EventName } from "../constants/eventnames";
import { InteractionEvent } from "../domain/events/InteractionEvent";
import { LogEvent } from "../domain/events/DomainEvent";
import { EventBus } from "../infra/EventBus";
import { ServerSettings } from "../domain/ServerSettings";
import { Colors } from "../constants/colors";

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
      case EventName.SLASH_CONFIG_EVENT:
        await slashConfig(event, this.domainClient);
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
      } - ${serverSettings.toString()}`,
      {
        actor: `${event.interaction.user.id}`,
        action: "applied",
        subject: `${event.interaction.guildId}`,
        metadata: {
          timestamp: Date.now(),
        },
      }
    )
  );

  if (serverSettings.enableWelcomePost && serverSettings.welcomePost) {
    const applicationEmbed = new EmbedBuilder()
      .setColor(serverSettings.welcomePost.color || Colors.Discord.BLURPLE)
      .setTitle(serverSettings.welcomePost.title)
      .setDescription(serverSettings.welcomePost.description)
      .setTimestamp();

    const apply = new ButtonBuilder()
      .setCustomId("test")
      .setLabel("Apply")
      .setStyle(ButtonStyle.Success)
      .setDisabled(serverSettings.acceptingApplications || true);

    const link = new ButtonBuilder()
      .setLabel("Learn More")
      .setStyle(ButtonStyle.Link)
      .setDisabled(serverSettings.webLink ? false : true)
      .setURL(serverSettings.webLink || "http://google.com/");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(apply, link);

    await event.interaction.reply({
      embeds: [applicationEmbed],
      components: [row],
      ephemeral: true,
    });
  } else {
    await event.interaction.reply({
      content: "guild hasn't set up their welcome post yet",
      ephemeral: true,
    });
  }
}

async function slashConfig(event: InteractionEvent, domainClient: DomainInteractionClient) {
  if (
    !event.interaction.guildId ||
    event.interaction.type === InteractionType.ApplicationCommandAutocomplete
  )
    return;
  const updated: boolean = await domainClient.updateServerSettings(event.interaction.guildId, {
    enableWelcomePost: true,
    welcomePost: {
      title: "Test",
      description: "description",
      color: Math.floor(Math.random() * 16777215),
    },
  });

  event.interaction.reply({
    content: `fake update complete successfully [${updated}]`,
    ephemeral: true,
  });
}
