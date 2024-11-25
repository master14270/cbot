import { ChatInputCommandInteraction, SlashCommandBuilder, Client, Collection } from "discord.js";

// Types vs. Classes?
export type HandleInteractionFunction = (interaction: ChatInputCommandInteraction) => void;

export type Command = {
	cooldown: number | undefined; // Cooldown in seconds.
	data: SlashCommandBuilder;
	execute: HandleInteractionFunction;
};

export type Event = {
	name: string;
	once: boolean;
	execute: Function;
};

export class MyClient extends Client {
	commands: Collection<string, Command>;
	cooldowns: Collection<string, Collection<string, number>>; // TODO: Better type definitions here.
}
