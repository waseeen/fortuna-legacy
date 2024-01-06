import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { getConfig } from '../../../config/config';
import { getEvents } from '../../../config/events';

export const requestClose = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });
  if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
  const requestChannel = interaction.guild.channels.cache.get(
    getConfig().channels.text.eventRequests,
  ) as TextChannel;
  const type = interaction.options.getString('type');
  const close = getEvents().closes.find((c) => {
    return c.value === type;
  });
  const requestEmbed = new EmbedBuilder()
    .setTitle('Запрос клоза')
    .setDescription(close.name)
    .setFields({
      name: 'Запрос от',
      value: `${interaction.user}`,
    })
    .setColor('Blue')
    .setFooter({ text: close.value });
  const takeReportButton = new ButtonBuilder()
    .setCustomId('takeClose')
    .setLabel('⚠')
    .setStyle(ButtonStyle.Danger);

  const rowOne = new ActionRowBuilder<ButtonBuilder>().addComponents(takeReportButton);
  await requestChannel.send({
    content: `<@&${getConfig().roles.closer}>`,
    embeds: [requestEmbed],
    components: [rowOne],
  });
  interaction.editReply({ content: 'Реквест был успешно отправлен' });
};
