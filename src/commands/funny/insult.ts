import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
	// Name your command, and describe it.
	data: new SlashCommandBuilder().setName("insult").setDescription("Generates an insult."),

	execute: async function (interaction: ChatInputCommandInteraction) {
		// Reach out to the insult api.
		const insultUrl = "https://evilinsult.com/generate_insult.php?lang=en&type=json";
		try {
			const response = await fetch(insultUrl);
			const json = await response.json();
			/*
                // Example response from this endpoint
                {
                    "number": "234",
                    "language": "en",
                    "insult": "Your gene pool could use a bit more chlorine.",
                    "created": "2024-11-24 00:41:51",
                    "shown": "23969",
                    "createdby": "",
                    "active": "1",
                    "comment": "https://imgur.com/gallery/ph1VT"
                }
            */

			await interaction.reply(json.insult);
		} catch (e) {
			await interaction.reply(
				"Sorry, we could not get an insult at this time. Get creative."
			);
		}
	},
};

/**
 * From documentation examples.
 */
