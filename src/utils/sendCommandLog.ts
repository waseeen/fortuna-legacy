import { client } from '../client';
import { ButtonInteraction, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { getConfig } from '../config/config';
import { sendErrorLog } from './sendErrorLog';

export const sendCommandLog = async (
  interaction: ChatInputCommandInteraction | ButtonInteraction,
): Promise<void> => {
  if (interaction.isChatInputCommand()) {
    let subc;
    try {
      subc = interaction.options.getSubcommand();
    } catch (e) {
      if (e.name == 'TypeError [CommandInteractionOptionNoSubcommand]') {
        subc = '';
      } else await sendErrorLog(e.name, e.message, e);
    }
    try {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`was executed by ${interaction.user}`);
      if (subc != '') {
        embed.setTitle(`Command "${interaction.commandName} ${subc}"`);
      } else {
        embed.setTitle(`Command "${interaction.commandName}"`);
      }
      for (const arg of interaction.options['_hoistedOptions']) {
        embed.addFields({
          name: `${arg.name}`,
          value: `${arg.value}`,
        });
      }

      await (
        client.channels.cache.get(getConfig().channels.text.log.commands) as TextChannel
      )?.send({
        embeds: [embed],
      });
    } catch (e) {
      console.log(e);
      await sendErrorLog(e.name, e.message, e);
    }
  } else if (interaction.isButton()) {
    const customId = interaction.customId;
    try {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`was executed by ${interaction.user}`);
      embed.setTitle(`Button "${customId}"`);

      await (
        client.channels.cache.get(getConfig().channels.text.log.commands) as TextChannel
      )?.send({
        embeds: [embed],
      });
    } catch (e) {
      console.log(e);
      await sendErrorLog(e.name, e.message, e);
    }
  }
};
