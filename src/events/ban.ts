import { GuildBan, TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { BotEvent } from '../types';
import { BansEntity } from '../database/Bans.entity';
import { getConfig } from '../config/config';
import db from '../connection';

const event: BotEvent = {
  name: 'guildBanAdd',
  execute: async (ban: GuildBan) => {
    const log = ban.guild.channels.cache.get(getConfig().channels.text.log.bans) as TextChannel;
    const repository = db.getRepository(BansEntity);
    const user = ban.user;
    const isBanned = await BansEntity.getBan(user.id);
    if (isBanned) return;
    const newBan = repository.create({
      user_id: user.id,
    });
    const embed = new EmbedBuilder()
      .setTitle('Бан')
      .setDescription(
        `${user} был забанен пкм\nЧтобы узнать, кем пользователь был забанен, проверьте журнал аудита`,
      )
      .setColor(getConfig().colors.ban_log);
    await log.send({ embeds: [embed] });

    await newBan.save();
  },
};

export default event;
