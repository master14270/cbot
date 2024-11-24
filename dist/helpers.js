import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
// Get the current directory of the script
const __dirname = import.meta.dirname;
export async function getAllValidCommands() {
    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);
    console.log(commandFolders);
    const validCommands = [];
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            // Convert file path to a file:// URL
            const urlPath = pathToFileURL(filePath).href;
            // TODO: Type hint this somehow? Typescript?
            //const command = require(filePath);
            console.log("going to try and include", urlPath);
            const rawImport = await import(urlPath);
            const command = rawImport.default;
            //const command = await import(urlPath).default;
            console.log("imported", command);
            //console.log("default", command.default);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ("data" in command && "execute" in command) {
                validCommands.push(command);
            }
            else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    return validCommands;
}
//# sourceMappingURL=helpers.js.map