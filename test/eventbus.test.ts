import { instance, mock, verify } from "ts-mockito";
import { EventBus } from "../src/infra/EventBus";
import { LogEvent } from "../src/domain/events/DomainEvent";
import { PrintHandler } from "../src/handlers/PrintHandler";

describe("eventbus", () => {
  let bus: EventBus = new EventBus();
  let mockedHandler: PrintHandler = mock(PrintHandler);
  let handler: PrintHandler = instance(mockedHandler);

  it("subscribe, publish, handle", () => {
    let event = new LogEvent("some event");

    // subscribe to log events
    bus.subscribe(event.name, handler);

    bus.publish(event);

    verify(mockedHandler.onEvent(event)).once();
  });
});
