export class Buttons {
  static readonly GUILD_APPLY_BUTTON: ButtonWithId = {
    id: "guild-apply",
    text: "Apply",
  };
  static readonly GUILD_LEARN_MORE_BUTTON: Button = {
    text: "Learn More",
  };
}
interface ButtonWithId extends Button {
  readonly id: string;
}

interface Button {
  readonly text: string;
}
