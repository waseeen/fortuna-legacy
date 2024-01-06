import {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  TextChannel,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { ReportCounterEntity } from '../../database/ReportCounter.entity';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('report')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription(
          'Участник сервера. Оставьте пустым, если не уверены, на кого хотите написать жалобу',
        )
        .setRequired(false);
    })
    .setDescription('Создать жалобу на пользователя'),
  execute: async (interaction) => {
    const reportChannel = interaction.guild.channels.cache.get(
      getConfig().channels.text.reports,
    ) as TextChannel;
    const target = interaction.options.getUser('user');

    const modal = new ModalBuilder().setCustomId('reportDescription').setTitle('Жалоба');
    const reportDescription = new TextInputBuilder()
      .setCustomId('repDescr')
      .setLabel('Опишите вашу жалобу')
      .setStyle(TextInputStyle.Paragraph);
    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      reportDescription,
    );
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
    const submit = await interaction.awaitModalSubmit({ time: 600000 }).catch();
    const reportNumber = await ReportCounterEntity.getCounter();
    reportNumber.counter += 1;
    reportNumber.save();
    const reportEmbed = new EmbedBuilder()
      .setTitle(`Репорт #${reportNumber.counter}`)
      .setDescription(submit.fields.getField('repDescr').value)
      .setFields(
        {
          name: 'Жалобу оставил',
          value: `${interaction.user}`,
        },
        {
          name: 'Жалоба на',
          value: target ? `${target}` : 'Неизвестно',
        },
      )
      .setColor('Red');
    const takeReportButton = new ButtonBuilder()
      .setCustomId('takeReport')
      .setLabel('⚠')
      .setStyle(ButtonStyle.Danger);

    const rowOne = new ActionRowBuilder<ButtonBuilder>().addComponents(takeReportButton);
    await reportChannel.send({
      content: `<@&${getConfig().roles.moderator}>`,
      embeds: [reportEmbed],
      components: [rowOne],
    });
    await submit.reply({
      content: `Жалоба #${reportNumber.counter} успешно отправлена`,
      ephemeral: true,
    });
  },
};

export default command;
