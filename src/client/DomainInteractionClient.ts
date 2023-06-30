import { ServerSettings } from "../domain/ServerSettings";

export abstract class DomainInteractionClient {
  abstract getServerSettings(discordId: string): Promise<ServerSettings>;
  abstract updateServerSettings(discordId: string, settings: ServerSettings): Promise<boolean>;
}
