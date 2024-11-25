import { Events, Collection } from "discord.js";
export default {
    name: Events.InteractionCreate,
    execute: async function (interaction) {
        // Only handling slash commands, there are other interactions the bot can receive.
        if (!interaction.isChatInputCommand())
            return;
        const myInteractionClient = interaction.client;
        const command = myInteractionClient.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        // Check for cooldowns.
        // TODO: Refactor this logic into another function for handling cooldowns.
        const { cooldowns } = myInteractionClient;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 5;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction
                    .reply({
                    content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                    ephemeral: true,
                })
                    .then(() => setTimeout(() => interaction.deleteReply(), expirationTime - now // not sure if you wanted 2000 (2s) or 20000 (20s)
                ));
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true, // Means message is only visible to user who initiated the interaction.
                });
            }
            else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    },
};
//# sourceMappingURL=interactionCreate.js.map