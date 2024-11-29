import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command, Event, MyClient } from "./types";
import { ChatInputCommandInteraction, Collection } from "discord.js";

// Get the current directory of the script
const __dirname = import.meta.dirname;

export async function getAllValidCommands() {
	const foldersPath = path.join(__dirname, "commands");
	const commandFolders = fs.readdirSync(foldersPath);
	const validCommands = [] as Array<Command>;

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);

			// Convert file path to a file:// URL
			const urlPath = pathToFileURL(filePath).href;
			const rawImport = await import(urlPath);
			const command = rawImport.default as Command;

			// Store the result.
			validCommands.push(command);
		}
	}

	return validCommands;
}

export async function getAllValidEvents() {
	const eventsPath = path.join(__dirname, "events");
	const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
	const validEvents = [] as Array<Event>;

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);

		// Convert file path to a file:// URL
		const urlPath = pathToFileURL(filePath).href;
		const rawImport = await import(urlPath);
		const event = rawImport.default as Event;
		validEvents.push(event);
	}

	return validEvents;
}

// TODO: Consider this being a generic function to handle all cooldowns?
export function handleCommandCooldowns(interaction: ChatInputCommandInteraction) {
	const result = {
		onCooldown: true,
	};

	// Get the client, and the commands of interest.
	const myInteractionClient = interaction.client as MyClient;
	const command = myInteractionClient.commands.get(interaction.commandName);

	// Check for cooldowns.
	const { cooldowns } = myInteractionClient;
	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 5; // TODO: Move this into a config file or something like that?
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1_000);

			// Is there a cleaner way to do this?
			interaction
				.reply({
					content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
					ephemeral: true,
				})
				.then(() => setTimeout(() => interaction.deleteReply(), expirationTime - now));
			return result;
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	result.onCooldown = false;
	return result;
}
