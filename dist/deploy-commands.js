// TODO: Use new function to get all commands. Will do after type hints are fixed.
import { REST, Routes } from "discord.js";
import { getAllValidCommands } from "./helpers.js";
import dotenv from "dotenv";
// Use .env file to get the environment variables.
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const commands = await getAllValidCommands();
const commandsDataJson = commands.map((command) => command.data.toJSON());
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);
// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandsDataJson,
        });
        /*
            // Use the below to apply commands to all servers using the bot.
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );
        */
        if (Array.isArray(data)) {
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        else {
            console.log("Unexpected type for data. Not sure what went wrong...");
        }
    }
    catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
//# sourceMappingURL=deploy-commands.js.map