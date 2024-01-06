import { SlashCommandBuilder, ChatInputCommandInteraction, ButtonInteraction } from 'discord.js';
import { Collection } from '@discordjs/collection';

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export interface Button {
  id: string;
  execute: (interaction: ButtonInteraction) => void;
}

export interface BotEvent {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    buttons: Collection<string, Button>;
    invites: Invite[];
  }
}
