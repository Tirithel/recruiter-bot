export class DomainEvent {
  name: string;
  msg?: string;

  constructor(name: string, msg?: string) {
    this.name = name;
    this.msg = msg;
  }
}
