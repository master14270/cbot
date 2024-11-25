import { Events } from "discord.js";
export default {
    name: Events.ClientReady,
    once: true,
    execute: function (client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
//# sourceMappingURL=ready.js.map