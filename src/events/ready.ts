import { Events } from "discord.js";
import { MyClient } from "../types";

export default {
	name: Events.ClientReady,
	once: true,
	execute: function (client: MyClient) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
