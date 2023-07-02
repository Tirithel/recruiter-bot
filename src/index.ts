import { Client, Collection, GatewayIntentBits, SlashCommandBuilder, Routes } from "discord.js";
import { Command, SlashCommand, BotEvent } from "./types";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { EventBus } from "./infra/EventBus";
import { PrintHandler } from "./handlers/PrintHandler";
import { EventName } from "./constants/eventnames";
import { DomainInteractionClient } from "./client/DomainInteractionClient";
import { DomainInteractionClientImpl } from "./client/DomainInteractionClientImpl";
import { REST } from "@discordjs/rest";
import { GuildEventHandler } from "./handlers/GuildEventHandler";
import { InteractionEventHandler } from "./handlers/InteractionEventHandler";

config();

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });
const domainClient: DomainInteractionClient = new DomainInteractionClientImpl();

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

// Set up EventBus
const eventBus = new EventBus();

// Set up Handlers
const printHandler: PrintHandler = new PrintHandler(client);
const guildEventHandler: GuildEventHandler = new GuildEventHandler(client, domainClient);
const interactionEventHandler: InteractionEventHandler = new InteractionEventHandler(
  client,
  eventBus,
  domainClient
);

// READY_EVENT
eventBus.subscribe(EventName.READY_EVENT, printHandler);

// LOG_EVENT
eventBus.subscribe(EventName.LOG_EVENT, printHandler);

// GUILD_JOIN_EVENT
eventBus.subscribe(EventName.GUILD_JOIN_EVENT, printHandler);
eventBus.subscribe(EventName.GUILD_JOIN_EVENT, guildEventHandler);

// SLASH_APPLY_EVENT
eventBus.subscribe(EventName.SLASH_APPLY_EVENT, interactionEventHandler);

// SLASH_CONFIG_EVENT
eventBus.subscribe(EventName.SLASH_CONFIG_EVENT, interactionEventHandler);

// SLASH_SET_EVENT
eventBus.subscribe(EventName.SLASH_SET_EVENT, interactionEventHandler);

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
const commands: SlashCommandBuilder[] = [];

let slashCommandsDir = join(__dirname, "commands/slash");

readdirSync(slashCommandsDir).forEach((file) => {
  if (!file.endsWith(".js")) return;
  let command: SlashCommand = require(`${slashCommandsDir}/${file}`).default;
  commands.push(command.command);
  client.slashCommands.set(command.command.name, command);

  console.info(`[Main]: successfully prepped command [${command.command.name}]`);
});

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands.map((command: SlashCommandBuilder) => {
      console.info(`[Main]: successfully sent command [${command.name}]`);
      return command.toJSON();
    }),
  })
  .then((data: any) => {
    console.info(`[Main]: successfully loaded [${data.length}] slash commands`);
  })
  .catch((e) => {
    console.log(e);
  });

// Auth
client.login(process.env.TOKEN);
