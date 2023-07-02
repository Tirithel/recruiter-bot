import { Client, Interaction, InteractionType, channelMention, roleMention } from "discord.js";
import { Handler } from "../infra/Handler";
import { DomainInteractionClient } from "../client/DomainInteractionClient";
import { EventName } from "../constants/eventnames";
import { InteractionEvent } from "../domain/events/InteractionEvent";
import { LogEvent } from "../domain/events/DomainEvent";
import { EventBus } from "../infra/EventBus";
import { ServerSettings, embedBuilder, buttonActionRowBuilder } from "../domain/ServerSettings";

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
      case EventName.SLASH_SET_EVENT:
        await slashSet(event, this.domainClient);
        break;
    }
  }
}

async function slashSet(event: InteractionEvent, domainClient: DomainInteractionClient) {
  if (!event.interaction.isChatInputCommand() || !event.interaction.guildId) return;
  switch (event.interaction.options.getSubcommand()) {
    case "recruiter-role":
      const recruiterRole =
        event.interaction.options.get("role-name")?.value?.toString() ?? "unknown";
      domainClient.updateServerSettings(event.interaction.guildId, {
        roles: {
          recruiterRoleID: recruiterRole,
        },
      });
      replyAndDelete(`recruiter-role updated to ${roleMention(recruiterRole)}`, event.interaction);
      break;
    case "member-role":
      const memberRole = event.interaction.options.get("role-name")?.value?.toString() ?? "unknown";
      domainClient.updateServerSettings(event.interaction.guildId, {
        roles: {
          memberRoleID: memberRole,
        },
      });
      replyAndDelete(`member-role updated to ${roleMention(memberRole)}`, event.interaction);
      break;
    case "recruitment-channel":
      const recruitmentChannel =
        event.interaction.options.get("channel-name")?.value?.toString() ?? "unknown";
      domainClient.updateServerSettings(event.interaction.guildId, {
        channels: {
          recruitmentChannelID: recruitmentChannel,
        },
      });
      replyAndDelete(
        `recruitment-channel updated to ${channelMention(recruitmentChannel)}`,
        event.interaction
      );
      break;
    case "welcome-channel":
      const welcomeChannel =
        event.interaction.options.get("channel-name")?.value?.toString() ?? "unknown";
      domainClient.updateServerSettings(event.interaction.guildId, {
        channels: {
          welcomeChannelID: welcomeChannel,
        },
      });
      replyAndDelete(
        `recruitment-channel updated to ${channelMention(welcomeChannel)}`,
        event.interaction
      );
      break;
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
        actor: `bot`,
        action: "application-response",
        subject: `${event.interaction.user.id}@${event.interaction.guildId}`,
        metadata: {
          timestamp: Date.now(),
        },
      }
    )
  );

  if (!serverSettings.features.disableApplyPost && serverSettings.applicationPost) {
    const embeds = embedBuilder([serverSettings.applicationPost.applyPost]);
    const buttons = buttonActionRowBuilder(serverSettings);

    await event.interaction.reply({
      embeds: embeds,
      components: [buttons],
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
  const interaction = event.interaction;
  if (!interaction.guildId || interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    return;
  }
  const updated: boolean = await domainClient.updateServerSettings(interaction.guildId, {
    webLink:
      "https://forums.ashesofcreation.com/discussion/41835/na-eu-oce-jp-enveus-hardcore-pvp-pve-economic-crafting-guild#latest",
    applicationPost: {
      applyPost: {
        title: "Enveus",
        description:
          "Enveus is a dedicated PvX Guild aiming to solidify its position as the dominant force in Ashes of Creation, while maintaining our unrivaled activity throughout the game's development.\n\nWe are actively seeking passionate players __with Alpha 2 access__, who are committed to extensively testing and actively participating in future testing phases of Ashes of Creation.",
        thumbnailURL:
          "https://media.discordapp.net/attachments/521920757702328330/671809429200437268/3HydraNoRingWhite.png",
        color: Math.floor(Math.random() * 16777215),
        footer: {
          text: "We are looking forward to your application!",
          iconURL:
            "https://media.discordapp.net/attachments/521920757702328330/671809429200437268/3HydraNoRingWhite.png",
        },
      },
    },
  });

  await interaction.reply({
    content: `fake update complete successfully [${updated}]`,
    ephemeral: true,
  });

  setTimeout(() => interaction.deleteReply(), 5000);
}

async function replyAndDelete(msg: string, interaction: Interaction) {
  if (interaction.isAutocomplete()) return;
  await interaction.reply({
    content: msg,
    ephemeral: true,
  });

  setTimeout(() => interaction.deleteReply(), 5000);
}
