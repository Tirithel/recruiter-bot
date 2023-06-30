import { DomainEvent } from "../domain/events/DomainEvent";
import { Handler } from "./Handler";

export class EventBus {
  private subscribers = new Map<String, Array<Handler>>();

  constructor() {
    console.info("[EventBus]: Start");
  }

  publish(event: DomainEvent) {
    let handlers: Array<Handler> = this.subscribers.get(event.name) ?? [];
    console.debug(
      `[EventBus]: publish - event [${event.name}], handlers [${handlers
        .map((h) => h.constructor.name)
        .join(" ")}]`
    );

    handlers.forEach((handler) => {
      // console.debug(
      //   `[EventBus]: onEvent - event [${event.name}], handler [${handler.constructor.name}]`
      // );
      handler.onEvent(event); // TODO: Async
      // console.debug(
      //   `[EventBus]: afterEvent - event [${event.name}], handler [${handler.constructor.name}]`
      // );
    });
  }

  subscribe(eventName: string, handler: Handler) {
    let currentHandlers: Array<Handler> = this.subscribers.get(eventName) ?? [];
    currentHandlers.push(handler);
    this.subscribers.set(eventName, currentHandlers);
    console.info(`[EventBus]: [${handler.constructor.name}] is now listening to [${eventName}]`);
  }
}
