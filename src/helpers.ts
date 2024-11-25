import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command, Event } from "./types";

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

			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ("data" in command && "execute" in command) {
				validCommands.push(command);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
				);
			}
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
