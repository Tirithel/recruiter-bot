import { OptionalConfig, ServerSettings } from "../domain/ServerSettings";

export abstract class DomainInteractionClient {
  abstract createServer(discordId: string): Promise<boolean>;
  abstract getServerSettings(discordId: string): Promise<ServerSettings>;
  abstract updateServerSettings(discordId: string, settings: OptionalConfig): Promise<boolean>;
}
