import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getEvents } from '../../config/events';
import { cstart } from './subcommands/cstart';
import { cend } from './subcommands/cend';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('close')
    .addSubcommand((subcommand) => {
      subcommand = new SlashCommandSubcommandBuilder()
        .setName('start')
        .setDescription('Начать клоз')
        .addStringOption((option) => {
          return option
            .setName('type')
            .setNameLocalization('ru', 'тип')
            .setDescription('Тип запускаемого клоза')
            .setChoices(...getEvents().closes)
            .setRequired(true);
        });
      return subcommand;
    })
    .addSubcommand((subcommand) => {
      subcommand = new SlashCommandSubcommandBuilder()
        .setName('end')
        .setDescription('Закончить клоз');
      return subcommand;
    })
    .setDescription('Ивент')
    .setDMPermission(false),
  execute: async (interaction) => {
    if (interaction.options.getSubcommand() === 'start') {
      cstart(interaction);
    }
    if (interaction.options.getSubcommand() === 'end') {
      cend(interaction);
    }
  },
};

export default command;
