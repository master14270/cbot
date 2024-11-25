// Require the necessary discord.js classes
import { Collection, GatewayIntentBits } from "discord.js";
import { getAllValidCommands, getAllValidEvents } from "./helpers.js";
import { MyClient } from "./types.js";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.DISCORD_TOKEN;

// Extend Client to include custom properties like commands
// TODO: Improve this.

// Create a new client instance
const client = new MyClient({ intents: [GatewayIntentBits.Guilds] });

// Load all valid commands, and store them in the client.
client.commands = new Collection();
const validCommands = await getAllValidCommands();
for (const command of validCommands) {
	client.commands.set(command.data.name, command);
}

// Create cooldowns.
client.cooldowns = new Collection();

// Load all valid events, apply them to the client.
const validEvents = await getAllValidEvents();
for (const event of validEvents) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token.
client.login(token);
