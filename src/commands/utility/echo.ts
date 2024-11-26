import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } from "discord.js";

export default {
	// Name your command, and describe it.
	data: new SlashCommandBuilder()
		.setName("echo")
		.setDescription("Replies with your input!")
		.addStringOption((option) =>
			option.setName("input").setDescription("The input to echo back").setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("The channel to echo into")
				.addChannelTypes(ChannelType.GuildText)
		)
		.addBooleanOption((option) =>
			option
				.setName("ephemeral")
				.setDescription("Whether or not the echo should be ephemeral")
		),

	// The code that runs when your command is called.
	execute: async function (interaction: ChatInputCommandInteraction) {
		const input = interaction.options.getString("input");
		const shouldBeEphemeral = interaction.options.getBoolean("ephemeral");
		const channel = interaction.options.getChannel("channel");

		if (channel === null) {
			await interaction.reply({
				content: input,
				ephemeral: shouldBeEphemeral,
			});
		} else {
			// Load the channel. If we can't send a message there, exit early.
			const fullChannel = await interaction.guild.channels.fetch(channel.id);
			if (!fullChannel.isSendable()) {
				await interaction.reply({
					content: "Unable to post in that channel, I don't have permission.",
					ephemeral: true,
				});
				return;
			}

			// Otherwise, send the message and let the user know command was executed successfully.
			await fullChannel.send(input);
			await interaction.reply({
				content: `Posted in ${fullChannel.name} successfully.`,
				ephemeral: true,
			});
		}
	},
};

/**
 * From documentation examples.
 */
