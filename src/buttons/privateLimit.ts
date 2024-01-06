import { GuildMember, TextInputStyle } from 'discord.js';
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import { Button } from '../types';
import { getConfig } from '../config/config';

const event: Button = {
  id: 'privateLimit',
  execute: async (interaction) => {
    const user = interaction.member as GuildMember;
    if (user.voice.channel?.parentId != getConfig().private.category)
      return interaction.deferUpdate();
    if (!user.voice.channel.permissionsFor(user).has('ManageChannels'))
      return interaction.deferUpdate();
    const modal = new ModalBuilder()
      .setCustomId('privateLimitModal')
      .setTitle('Изменение лимита пользователей');
    const privateLimitRow = new TextInputBuilder()
      .setCustomId('privateLimitRow')
      .setLabel('Количество пользователей')
      .setStyle(TextInputStyle.Short);
    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      privateLimitRow,
    );
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
    const submit = await interaction.awaitModalSubmit({ time: 600000 }).catch();
    const submitValue = parseInt(submit.fields.getField('privateLimitRow').value);
    if (isNaN(submitValue))
      return await submit.reply({
        content: `"${submit.fields.getField('privateLimitRow').value}" это не число`,
        ephemeral: true,
      });
    if (submitValue > 99)
      return await submit.reply({
        content: 'Лимит пользователей в голосовом канале не может быть больше 99',
        ephemeral: true,
      });

    await user.voice.channel.setUserLimit(submitValue);
    return await submit.reply({
      content: `Лимит привата успешно изменен на "${submitValue}"`,
      ephemeral: true,
    });
  },
};

export default event;
