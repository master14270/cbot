import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type HandleInteractionFunction = (interaction: ChatInputCommandInteraction) => void;

export type Command = {
	data: SlashCommandBuilder;
	execute: HandleInteractionFunction;
};
