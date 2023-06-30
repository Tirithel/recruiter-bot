import { Guild } from "discord.js";
import { BotEvent } from "../types";
import { GuildJoinEvent } from "../events/GuildJoinEvent";
import { EventBus } from "../infra/EventBus";

const event: BotEvent = {
  name: "guildCreate",
  execute: (guild: Guild, bus: EventBus) => {
    bus.publish(new GuildJoinEvent(guild));
  },
};

export default event;
