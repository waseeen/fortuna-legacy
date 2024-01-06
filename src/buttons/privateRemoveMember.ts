import { ComponentType, GuildMember } from 'discord.js';
import { ActionRowBuilder, UserSelectMenuBuilder } from '@discordjs/builders';
import { Button } from '../types';
import { getConfig } from '../config/config';

const event: Button = {
  id: 'privateRemoveMember',
  execute: async (interaction) => {
    const user = interaction.member as GuildMember;
    if (user.voice.channel?.parentId != getConfig().private.category)
      return interaction.deferUpdate();
    if (!user.voice.channel.permissionsFor(user).has('ManageChannels'))
      return interaction.deferUpdate();
    const selector = new UserSelectMenuBuilder()
      .setCustomId('removeUserSelector')
      .setPlaceholder('Выберите пользователя');
    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(selector);
    await interaction.reply({
      content: 'Выберите пользователя, которому хотите запретить доступ в приват',
      components: [row],
      ephemeral: true,
    });
    const response = await interaction.fetchReply();
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.UserSelect,
      time: 600000,
    });
    collector.on('collect', async (select) => {
      const member = await interaction.guild.members.fetch(select.values[0]);
      await user.voice.channel.permissionOverwrites.edit(member, {
        Connect: false,
      });
      await select.deferUpdate();
      if (member.voice.channelId === user.voice.channelId) await member.voice.setChannel(null);
      await interaction.editReply({ content: `${member} был выгнан из привата` });
    });
  },
};

export default event;
