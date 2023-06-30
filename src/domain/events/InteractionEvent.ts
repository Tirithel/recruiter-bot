import { Interaction } from "discord.js";
import { EventName } from "../../constants/eventnames";
import { DomainEvent } from "./DomainEvent";

export interface InteractionEvent extends DomainEvent {
  interaction: Interaction;
}

export class UnknownInteractionEvent implements InteractionEvent {
  interaction: Interaction;
  name: string = EventName.UNKNOWN_INTERACTION_EVENT;
  msg?: string | undefined;

  constructor(interaction: Interaction, msg?: string) {
    this.msg = msg;
    this.interaction = interaction;
  }
}
