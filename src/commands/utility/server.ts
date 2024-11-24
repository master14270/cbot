import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Provides information about the server."),

	execute: async function (interaction: ChatInputCommandInteraction) {
		await interaction.reply(
			`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
		);
	},
};

/**
 * From documentation examples.
 */
