import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getEvents } from '../../config/events';
import { requestClose } from './subcommands/requestClose';
import { requestEvent } from './subcommands/requestEvent';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('request')
    .addSubcommand((subcommand) => {
      subcommand = new SlashCommandSubcommandBuilder()
        .setName('close')
        .setDescription('Зкакзать клоз')
        .addStringOption((option) => {
          return option
            .setName('type')
            .setNameLocalization('ru', 'тип')
            .setDescription('Тип клоза')
            .setChoices(...getEvents().closes)
            .setRequired(true);
        });
      return subcommand;
    })
    .addSubcommand((subcommand) => {
      subcommand = new SlashCommandSubcommandBuilder()
        .setName('event')
        .setDescription('Заказать ивент')
        .addStringOption((option) => {
          return option
            .setName('type')
            .setNameLocalization('ru', 'тип')
            .setDescription('Тип ивента')
            .setChoices(...getEvents().events)
            .setRequired(true);
        });
      return subcommand;
    })
    .setDescription('Заказать ивент')
    .setDMPermission(false),
  execute: async (interaction) => {
    if (interaction.options.getSubcommand() === 'close') {
      requestClose(interaction);
    }
    if (interaction.options.getSubcommand() === 'event') {
      requestEvent(interaction);
    }
  },
};

export default command;
