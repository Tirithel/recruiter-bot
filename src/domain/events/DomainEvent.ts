import { EventName } from "../../constants/eventnames";
import { Audit } from "../Audit";

export interface DomainEvent {
  readonly name: string;
  msg?: string;
}

export class ReadyEvent implements DomainEvent {
  readonly name: string = EventName.READY_EVENT;
}

export class LogEvent implements DomainEvent {
  readonly name: string = EventName.LOG_EVENT;
  msg?: string;
  event?: Audit;

  constructor(msg?: string, event?: Audit) {
    this.msg = msg;
    this.event = event;
  }
}
