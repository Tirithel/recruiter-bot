import { Interaction } from "discord.js";
import { EventName } from "../../constants/eventnames";
import { DomainEvent } from "./DomainEvent";

export interface InteractionEvent extends DomainEvent {
  interaction: Interaction;
}

export class SlashApplyEvent implements InteractionEvent {
  interaction: Interaction;
  readonly name: string = EventName.SLASH_APPLY_EVENT;
  msg?: string | undefined;

  constructor(interaction: Interaction, msg?: string) {
    this.msg = msg;
    this.interaction = interaction;
  }
}

export class SlashConfigEvent implements InteractionEvent {
  interaction: Interaction;
  readonly name: string = EventName.SLASH_CONFIG_EVENT;
  msg?: string | undefined;

  constructor(interaction: Interaction, msg?: string) {
    this.msg = msg;
    this.interaction = interaction;
  }
}

export class SlashSetEvent implements InteractionEvent {
  interaction: Interaction;
  readonly name: string = EventName.SLASH_SET_EVENT;
  msg?: string | undefined;

  constructor(interaction: Interaction, msg?: string) {
    this.interaction = interaction;
    this.msg = msg;
  }
}

export class UnknownInteractionEvent implements InteractionEvent {
  interaction: Interaction;
  readonly name: string = EventName.UNKNOWN_INTERACTION_EVENT;
  msg?: string | undefined;

  constructor(interaction: Interaction, msg?: string) {
    this.msg = msg;
    this.interaction = interaction;
  }
}
