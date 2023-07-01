import { Interaction, InteractionType } from "discord.js";
import { BotEvent } from "../types";
import { EventBus } from "../infra/EventBus";
import { UnknownInteractionEvent } from "../domain/events/InteractionEvent";
import { LogEvent } from "../domain/events/DomainEvent";

const event: BotEvent = {
  name: "interactionCreate",
  execute: (interaction: Interaction, eventBus: EventBus) => {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        eventBus.publish(
          new LogEvent(
            `a [user ${interaction.user.id} @ guild ${interaction.guildId}] used [${interaction.commandName}]`,
            {
              actor: `${interaction.user.id}`,
              action: `${interaction.commandName}`,
              subject: `${interaction.guildId}`,
              metadata: {
                timestamp: Date.now(),
              },
            }
          )
        );
        executeSlashCommand(interaction, eventBus);
        break;
      case InteractionType.MessageComponent:
        eventBus.publish(new LogEvent("a message component event happened"));
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        eventBus.publish(new LogEvent("an application command autocomplete event happened"));
        break;
      case InteractionType.ModalSubmit:
        eventBus.publish(new LogEvent("a modal submit event happened"));
        break;
      default:
        eventBus.publish(new UnknownInteractionEvent(interaction, "unknown interaction happened"));
        eventBus.publish(new LogEvent("an unknown event happened"));
    }
  },
};

function executeSlashCommand(interaction: Interaction, eventBus: EventBus) {
  if (!interaction.isChatInputCommand()) return;
  let command = interaction.client.slashCommands.get(interaction.commandName);
  let cooldown = interaction.client.cooldowns.get(
    `${interaction.commandName}-${interaction.user.username}`
  );
  if (!command) return;
  if (command.cooldown && cooldown) {
    if (Date.now() < cooldown) {
      interaction.reply({
        content: `Please wait ${Math.floor(
          Math.abs(Date.now() - cooldown) / 1000
        )} second(s) to use this command again`,
        ephemeral: true,
      });
      setTimeout(() => interaction.deleteReply(), 5000);
      return;
    }

    interaction.client.cooldowns.set(
      `${interaction.commandName}-${interaction.user.username}`,
      Date.now() + command.cooldown * 1000
    );
    setTimeout(() => {
      interaction.client.cooldowns.delete(
        `${interaction.commandName}-${interaction.user.username}`
      );
    }, command.cooldown * 1000);
  } else if (command.cooldown && !cooldown) {
    interaction.client.cooldowns.set(
      `${interaction.commandName}-${interaction.user.username}`,
      Date.now() + command.cooldown * 1000
    );
  }
  command.execute(interaction, eventBus);
}

export default event;
