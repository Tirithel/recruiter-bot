import { EventName } from "../../constants/eventnames";

export interface DomainEvent {
  readonly name: string;
  msg?: string;
}

export class ReadyEvent implements DomainEvent {
  readonly name: string = EventName.READY_EVENT;
  msg: string = "server is up";
}

export class LogEvent implements DomainEvent {
  readonly name: string = EventName.LOG_EVENT;
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}
