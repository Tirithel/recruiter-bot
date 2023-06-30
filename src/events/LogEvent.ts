import { EventName } from "../constants/eventnames";
import { DomainEvent } from "./DomainEvent";

export class LogEvent extends DomainEvent {
  constructor(msg: string) {
    super(EventName.LOG_EVENT, msg);
  }
}
