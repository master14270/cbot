import { Events, Interaction, Collection } from "discord.js";
import { MyClient } from "../types";
import { handleCommandCooldowns } from "../helpers.js";

export default {
	name: Events.InteractionCreate,
	execute: async function (interaction: Interaction) {
		// Only handling slash commands, there are other interactions the bot can receive.
		if (!interaction.isChatInputCommand()) return;

		const myInteractionClient = interaction.client as MyClient;

		const command = myInteractionClient.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		// Check for cooldowns, and update cooldown state.
		const { onCooldown } = handleCommandCooldowns(interaction);
		if (onCooldown) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true, // Means message is only visible to user who initiated the interaction.
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	},
};
