import { ChannelType, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { EventBus } from "../../infra/EventBus";
import { SlashSetEvent } from "../../domain/events/InteractionEvent";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Set up server configuration.")
    .addSubcommandGroup((group) =>
      group
        .setName("role")
        .setDescription("option to change")
        .addSubcommand((sub) =>
          sub
            .setName("recruiter-role")
            .setDescription("role to notify when posting")
            .addRoleOption((opt) =>
              opt
                .setName("role-name")
                .setDescription("the role to notify when posting")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("member-role")
            .setDescription("member role")
            .addRoleOption((opt) =>
              opt
                .setName("role-name")
                .setDescription("member role to assign when approved")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("channel")
        .setDescription("option to change")
        .addSubcommand((sub) =>
          sub
            .setName("recruitment-channel")
            .setDescription("channel to post recruitment messages in")
            .addChannelOption((opt) =>
              opt
                .setName("channel-name")
                .setDescription("the recruitment channel name")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("welcome-channel")
            .setDescription("channel to update welcome message in")
            .addChannelOption((opt) =>
              opt
                .setName("channel-name")
                .setDescription("the welcome channel name")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
    ),
  execute: async (interaction, bus: EventBus) => {
    if (interaction.isChatInputCommand())
      bus.publish(new SlashSetEvent(interaction, interaction.options.getSubcommand()));
  },
  cooldown: 10,
};

export default command;
