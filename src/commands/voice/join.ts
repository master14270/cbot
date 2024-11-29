import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

export default {
	// Name your command, and describe it.
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Joins users current voice channel."),

	// The code that runs when your command is called.
	execute: async function (interaction: ChatInputCommandInteraction) {
		// Tells TypeScript what we are dealing with.
		if (!(interaction.member instanceof GuildMember)) {
			interaction.reply({
				content: "Command not recieved from a discord server. Can't join!",
				ephemeral: true,
			});
			return;
		}

		// TODO: Fix bug with cached data?
		const member = await interaction.member.fetch(true);
		const channel = member.voice.channel;
		if (!channel) {
			interaction.reply({
				content: "You aren't in a voice channel.",
				ephemeral: true,
			});
			return;
		}

		joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		interaction.reply({
			content: `Got it. In ${channel.name}`,
			ephemeral: true,
		});
	},
};

/**
 * From documentation examples.
 */
