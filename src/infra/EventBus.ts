import { DomainEvent } from "../events/DomainEvent";
import { Handler } from "./Handler";

export class EventBus {
  private subscribers = new Map<String, Array<Handler>>();

  constructor() {
    console.info("event bus initialized");
  }

  publish(event: DomainEvent) {
    let handlers: Array<Handler> = this.subscribers.get(event.name) ?? [];
    console.info(
      `publish:: event [${event.name}], handlers [${handlers
        .map((h) => h.constructor.name)
        .join(" ")}]`
    );

    handlers.forEach((handler) => {
      console.info(
        `onEvent:: event [${event.name}], handler [${handler.constructor.name}]`
      );
      handler.onEvent(event);
      console.info(
        `afterEvent:: event [${event.name}], handler [${handler.constructor.name}]`
      );
    });
  }

  subscribe(eventName: string, handler: Handler) {
    let currentHandlers: Array<Handler> = this.subscribers.get(eventName) ?? [];
    currentHandlers.push(handler);
    this.subscribers.set(eventName, currentHandlers);
    console.log(`[${handler.constructor.name}] is listening to [${eventName}]`);
  }
}
