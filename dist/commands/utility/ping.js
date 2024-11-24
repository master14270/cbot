import { SlashCommandBuilder } from "discord.js";
export default {
    // Name your command, and describe it.
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    // The code that runs when your command is called.
    execute: async function (interaction) {
        await interaction.reply("Pong!");
    },
};
/**
 * From documentation examples.
 */
//# sourceMappingURL=ping.js.map