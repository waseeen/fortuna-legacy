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
  id: 'privateName',
  execute: async (interaction) => {
    const user = interaction.member as GuildMember;
    if (user.voice.channel?.parentId != getConfig().private.category)
      return interaction.deferUpdate();
    if (!user.voice.channel.permissionsFor(user).has('ManageChannels'))
      return interaction.deferUpdate();
    const modal = new ModalBuilder()
      .setCustomId('privateTitle')
      .setTitle('Изменение названия привата');
    const privateTitleName = new TextInputBuilder()
      .setCustomId('privateTitleName')
      .setLabel('Новое название')
      .setStyle(TextInputStyle.Short);
    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      privateTitleName,
    );
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
    const submit = await interaction.awaitModalSubmit({ time: 600000 }).catch();
    await user.voice.channel.setName(submit.fields.getField('privateTitleName').value);
    await submit.reply({
      content: `Название привата успешно изменено на "${
        submit.fields.getField('privateTitleName').value
      }"`,
      ephemeral: true,
    });
  },
};

export default event;
