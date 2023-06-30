import { Interaction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { EventBus } from "../../infra/EventBus";
import { SlashApplyEvent } from "../../domain/events/InteractionEvent";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("apply")
    .setDescription("Shows the application process for the guild."),
  execute: (interaction, eventBus: EventBus) => {
    eventBus.publish(new SlashApplyEvent(<Interaction>interaction));
  },
  cooldown: 3600,
};

export default command;
