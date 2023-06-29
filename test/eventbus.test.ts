import { instance, mock, verify } from "ts-mockito";
import { EventBus } from "../src/infra/EventBus";
import { DomainEvent } from "../src/events/DomainEvent";
import { PrintHandler } from "../src/handlers/PrintHandler";

describe("eventbus", () => {
  let bus: EventBus = new EventBus();
  let mockedHandler: PrintHandler = mock(PrintHandler);
  let handler: PrintHandler = instance(mockedHandler);

  it("subscribe, publish, handle", () => {
    let event = new DomainEvent("some-event");

    bus.subscribe("some-event", handler);

    bus.publish(event);

    verify(mockedHandler.onEvent(event)).once();
  });
});
