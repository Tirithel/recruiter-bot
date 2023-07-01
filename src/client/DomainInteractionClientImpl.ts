import { DefaultFeatures, OptionalConfig, ServerSettings } from "../domain/ServerSettings";
import { DomainInteractionClient } from "./DomainInteractionClient";

export class DomainInteractionClientImpl extends DomainInteractionClient {
  private guilds = new Map<string, ServerSettings>();

  createServer(discordId: string): Promise<boolean> {
    return new Promise((r) => {
      this.guilds.set(discordId, { features: new DefaultFeatures() });
      r(true);
    });
  }

  getServerSettings(discordId: string): Promise<ServerSettings> {
    return new Promise((r) => r(this.guilds.get(discordId) || { features: new DefaultFeatures() }));
  }
  updateServerSettings(discordId: string, settings: OptionalConfig): Promise<boolean> {
    return new Promise((r) => {
      this.getServerSettings(discordId).then((current) =>
        this.guilds.set(discordId, { ...current, ...settings })
      );
      r(true);
    });
  }
}
