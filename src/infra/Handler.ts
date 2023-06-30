import { DomainEvent } from "../domain/events/DomainEvent";

export abstract class Handler {
  abstract onEvent(event: DomainEvent): void; // TODO: Async
}
