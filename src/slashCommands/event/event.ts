import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getEvents } from '../../config/events';
import { eend } from './subcommands/eend';
import { estart } from './subcommands/estart';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('event')
    .addSubcommand((subcommand) => {
      subcommand = new SlashCommandSubcommandBuilder()
        .setName('start')
        .setDescription('Начать ивент')
        .addStringOption((option) => {
          return option
            .setName('type')
            .setNameLocalization('ru', 'тип')
            .setDescription('Тип запускаемого ивента')
            .setChoices(...getEvents().events)
            .setRequired(true);
        });
      return subcommand;
    })
    .addSubcommand((subcommand) => {
      subcommand = new SlashCommandSubcommandBuilder()
        .setName('end')
        .setDescription('Закончить ивент');
      return subcommand;
    })
    .setDescription('Ивент')
    .setDMPermission(false),
  execute: async (interaction) => {
    if (interaction.options.getSubcommand() === 'start') {
      estart(interaction);
    }
    if (interaction.options.getSubcommand() === 'end') {
      eend(interaction);
    }
  },
};

export default command;
