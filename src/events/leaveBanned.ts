import { GuildMember, TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { BotEvent } from '../types';
import { getConfig } from '../config/config';
import { BansEntity } from '../database/Bans.entity';

const event: BotEvent = {
  name: 'guildMemberRemove',
  execute: async (user: GuildMember) => {
    const log = user.guild.channels.cache.get(getConfig().channels.text.log.join) as TextChannel;
    const isBanned = await BansEntity.getBan(user.id);
    const embed = new EmbedBuilder().setDescription(`:no_pedestrians: ${user} вышел с сервера`);
    if (!isBanned) return await log.send({ embeds: [embed] });
    embed.setFooter({
      text: 'Был забанен, при перезаходе на сервер будет выдана роль ban',
    });
    await log.send({ embeds: [embed] });
  },
};

export default event;
