import { ServerSettings } from "../domain/ServerSettings";
import { DomainInteractionClient } from "./DomainInteractionClient";

export class DomainInteractionClientImpl extends DomainInteractionClient {
  private guilds = new Map<string, ServerSettings>();

  getServerSettings(discordId: string): Promise<ServerSettings> {
    return new Promise((r) => r(this.guilds.get(discordId) || {}));
  }
  updateServerSettings(discordId: string, settings: ServerSettings): Promise<boolean> {
    return new Promise((r) => {
      this.guilds.set(discordId, { ...this.getServerSettings(discordId), ...settings });
      r(true);
    });
  }
}
