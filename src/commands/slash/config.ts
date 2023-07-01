import { Interaction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { EventBus } from "../../infra/EventBus";
import { SlashConfigEvent } from "../../domain/events/InteractionEvent";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Fake configuration stub - placeholder."),
  execute: (interaction, eventBus: EventBus) => {
    eventBus.publish(new SlashConfigEvent(<Interaction>interaction));
  },
};

export default command;
