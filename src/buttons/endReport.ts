import { GuildMember } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Button } from '../types';

const event: Button = {
  id: 'endReport',
  execute: async (interaction) => {
    const moder = interaction.member as GuildMember;
    const embed = interaction.message.embeds[0];
    if (embed.fields[2].value.slice(2, -1) != moder.id)
      return await interaction.reply({ content: 'Не вы разбираете репорт', ephemeral: true });
    const reportChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === embed.title,
    );
    await reportChannel.delete();
    const newEmbed = new EmbedBuilder(embed).setTitle(embed.title + ' разобран').setColor(0x57f287);
    await interaction.message.edit({ embeds: [newEmbed], components: [] });
    return await interaction.reply({ content: 'Вы закончили разбор репорта', ephemeral: true });
  },
};

export default event;
