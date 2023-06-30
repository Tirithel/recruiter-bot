import { Guild } from "discord.js";
import { DomainEvent } from "./DomainEvent";
import { EventName } from "../../constants/eventnames";

export interface GuildEvent extends DomainEvent {
  guild: Guild;
}

export class GuildJoinEvent implements GuildEvent {
  guild: Guild;
  readonly name: string = EventName.GUILD_JOIN_EVENT;
  msg?: string | undefined;

  constructor(guild: Guild, msg?: string) {
    this.guild = guild;
    this.msg = msg;
  }
}
