import { EventName } from "../constants/eventnames";
import { DomainEvent } from "./DomainEvent";

export class ReadyEvent extends DomainEvent {
  constructor() {
    super(EventName.READY_EVENT);
  }
}
