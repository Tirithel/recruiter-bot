import { BotEvent } from "../types";
import { EventBus } from "../infra/EventBus";
import { Client } from "discord.js";
import { ReadyEvent, LogEvent } from "../domain/events/DomainEvent";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: (_: Client, bus: EventBus) => {
    bus.publish(new ReadyEvent());
    bus.publish(
      new LogEvent("the server is ready", {
        actor: `server`,
        action: `ready`,
        subject: `bot`,
        metadata: {
          timestamp: Date.now(),
        },
      })
    );
  },
};

export default event;
