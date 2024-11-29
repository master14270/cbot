import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export default {
	// Name your command, and describe it.
	data: new SlashCommandBuilder()
		.setName("dc")
		.setDescription("Makes the bot leave voice channel."),

	// The code that runs when your command is called.
	execute: async function (interaction: ChatInputCommandInteraction) {
		// TODO: Fix bug, this seems to be caching voice channels or something?
		const guildMember = await interaction.guild.members.fetch({
			user: interaction.client.user,
			force: true,
		});

		const channel = guildMember.voice.channel;
		if (!channel) {
			interaction.reply({
				content: `Not in a channel.`,
				ephemeral: true,
			});
			return;
		}

		const connection = getVoiceConnection(channel.guild.id);
		if (!connection) {
			interaction.reply({
				content: `Not connected.`,
				ephemeral: true,
			});
			return;
		}

		connection.destroy();
		interaction.reply({
			content: `Done.`,
			ephemeral: true,
		});
	},
};

/**
 * From documentation examples.
 */
