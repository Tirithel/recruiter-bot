import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command, SlashCommand, BotEvent } from "./types";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { EventBus } from "./infra/EventBus";
import { PrintHandler } from "./handlers/PrintHandler";
import { EventName } from "./constants/eventnames";

config();

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

// Set up Handlers
const printHandler: PrintHandler = new PrintHandler(client);

// Set up EventBus
const eventBus = new EventBus();

// READY_EVENT
eventBus.subscribe(EventName.READY_EVENT, printHandler);

// LOG_EVENT
eventBus.subscribe(EventName.LOG_EVENT, printHandler);

// GUILD_JOIN_EVENT
eventBus.subscribe(EventName.GUILD_JOIN_EVENT, printHandler);

// ... Other Events ...

// Event Producers
let eventsDir = join(__dirname, "event-producers");
readdirSync(eventsDir).forEach((file) => {
  if (!file.endsWith(".js")) return;

  let event: BotEvent = require(`${eventsDir}/${file}`).default;

  event.once
    ? client.once(event.name, (...args) => event.execute(...args, eventBus))
    : client.on(event.name, (...args) => event.execute(...args, eventBus));

  console.info(`[Main]: successfully loaded event-producer [${event.name}]`);
});

// Slash Commands

// Auth
client.login(process.env.TOKEN);
