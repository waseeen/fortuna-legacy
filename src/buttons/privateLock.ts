import { GuildMember } from 'discord.js';
import { Button } from '../types';
import { getConfig } from '../config/config';

const event: Button = {
  id: 'privateLock',
  execute: async (interaction) => {
    const user = interaction.member as GuildMember;
    if (user.voice.channel?.parentId != getConfig().private.category)
      return interaction.deferUpdate();
    if (!user.voice.channel.permissionsFor(user).has('ManageChannels'))
      return interaction.deferUpdate();
    await user.voice.channel.permissionOverwrites.edit(interaction.guild.id, {
      Connect: false,
    });
    return await interaction.reply({
      content: 'Приват закрыт от всех пользователей',
      ephemeral: true,
    });
  },
};

export default event;
