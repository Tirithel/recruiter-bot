import { DomainEvent } from "../events/DomainEvent";

export abstract class Handler {
  abstract onEvent(event: DomainEvent): void; // TODO: Async
}
