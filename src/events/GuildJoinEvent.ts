import { Guild } from "discord.js";
import { EventName } from "../constants/eventnames";
import { DomainEvent } from "./DomainEvent";

export class GuildJoinEvent extends DomainEvent {
  guild: Guild;
  constructor(guild: Guild) {
    super(EventName.GUILD_JOIN_EVENT, `bot joined ${guild.id} server`);
    this.guild = guild;
  }
}
