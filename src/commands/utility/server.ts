import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Provides information about the server."),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute: async function (interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		//console.log(interaction);

		await interaction.reply(
			`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
		);
	},
};

/**
 * From documentation examples.
 */
