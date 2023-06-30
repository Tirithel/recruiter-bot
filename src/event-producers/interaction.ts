import { Interaction, InteractionType } from "discord.js";
import { BotEvent } from "../types";
import { EventBus } from "../infra/EventBus";
import { UnknownInteractionEvent } from "../domain/events/InteractionEvent";
import { LogEvent } from "../domain/events/DomainEvent";

const event: BotEvent = {
  name: "interactionCreate",
  execute: (interaction: Interaction, bus: EventBus) => {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        bus.publish(new LogEvent("an application command happened"));
        break;
      case InteractionType.MessageComponent:
        bus.publish(new LogEvent("a message component event happened"));
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        bus.publish(new LogEvent("an application command autocomplete event happened"));
        break;
      case InteractionType.ModalSubmit:
        bus.publish(new LogEvent("a modal submit event happened"));
        break;
      default:
        bus.publish(new UnknownInteractionEvent(interaction, "unknown interaction happened"));
        bus.publish(new LogEvent("an unknown event happened"));
    }
  },
};

export default event;
