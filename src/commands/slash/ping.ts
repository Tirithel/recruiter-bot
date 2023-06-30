import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { EventBus } from "../../infra/EventBus";

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName("ping").setDescription("Shows the bot's ping"),
  execute: async (interaction, _: EventBus) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${interaction.client.user?.tag}` })
          .setDescription(`🏓\t**Pong!** \n 📡\t**Ping:**\t${interaction.client.ws.ping}`),
      ],
    });
  },
  cooldown: 10,
};

export default command;
