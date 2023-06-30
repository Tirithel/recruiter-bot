import { BotEvent } from "../types";
import { EventBus } from "../infra/EventBus";
import { ReadyEvent } from "../domain/events/DomainEvent";
import { Client } from "discord.js";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: (_: Client, bus: EventBus) => {
    bus.publish(new ReadyEvent());
  },
};

export default event;
