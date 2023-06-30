import { Interaction } from "discord.js";
import { EventName } from "../constants/eventnames";
import { DomainEvent } from "./DomainEvent";

export class UnknownInteractionEvent extends DomainEvent {
  interaction: Interaction;
  constructor(msg: string, interaction: Interaction) {
    super(EventName.UNKNOWN_INTERACTION_EVENT, msg);
    this.interaction = interaction;
  }
}
