import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Colors } from "../constants/colors";
import { Buttons } from "../constants/buttons";

export interface ServerSettings extends OptionalConfig {
  features: Features;
}

// toggle featured defaulted to false
export interface Features {
  disableApply: boolean;
  disableApplyPost: boolean;
  disableWelcome: boolean;
  disableWebLink: boolean;
}

export class DefaultFeatures implements Features {
  disableApply = false;
  disableApplyPost = false;
  disableWelcome = false;
  disableWebLink = false;
}

export interface OptionalConfig {
  channels?: {
    welcomeChannelID?: string; // discord channel ID
    recruitmentChannelID?: string; // discord channel ID
  };
  webLink?: string;
  applicationPost?: {
    applyPost: EmbedSetting;
  };
  welcomePost?: {
    bannerAsset?: string;
    embeds: EmbedSetting[];
  };
}

export interface EmbedSetting {
  title?: string;
  description?: string;
  thumbnailURL?: string;
  color?: number;
  fields?: FieldSetting[];
  footer?: FooterSetting;
  timestamp?: boolean;
}

export interface FieldSetting {
  name?: string;
  value?: string;
  inline?: boolean;
}

export interface FooterSetting {
  text?: string;
  iconURL?: string;
}

export class EmptyFooterSetting implements FooterSetting {
  text = "\u200B";
}

export class EmptyFieldSetting implements FieldSetting {
  name = "\u200B";
  value = "\u200B";
  inline = false;
}

export function buttonActionRowBuilder(serverSettings: ServerSettings) {
  const apply = new ButtonBuilder()
    .setCustomId(Buttons.GUILD_APPLY_BUTTON.id)
    .setLabel(Buttons.GUILD_APPLY_BUTTON.text)
    .setStyle(ButtonStyle.Success)
    .setDisabled(serverSettings.features.disableApply);

  const link = new ButtonBuilder()
    .setLabel("Learn More")
    .setStyle(ButtonStyle.Link)
    .setDisabled(serverSettings.features.disableWebLink)
    .setURL(serverSettings.webLink || "http://google.com/");

  return new ActionRowBuilder<ButtonBuilder>().addComponents(apply, link);
}

export function embedBuilder(embedSettings: EmbedSetting[] | undefined) {
  let builders: EmbedBuilder[] = new Array();

  if (embedSettings === undefined) return builders;

  embedSettings.forEach((settings) => {
    const embed = new EmbedBuilder()
      .setTitle(settings.title || null)
      .setDescription(settings.description || null)
      .setThumbnail(settings.thumbnailURL || null)
      .setColor(settings.color || Colors.Discord.BLURPLE)
      .setFooter({ ...new EmptyFooterSetting(), ...settings.footer });

    if (settings.fields !== undefined)
      settings.fields.forEach((field) => embed.addFields({ ...new EmptyFieldSetting(), ...field }));
    if (settings.timestamp !== undefined) embed.setTimestamp();

    builders.push(embed);
  });

  return builders;
}
