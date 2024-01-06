import { GuildMember, Invite, Routes, TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { BotEvent } from '../types';
import { getConfig } from '../config/config';
import { BansEntity } from '../database/Bans.entity';
import { VmuteEntity } from '../database/Vmute.entity';
import { TmuteEntity } from '../database/Tmute.entity';
import { client, rest } from '../client';

const event: BotEvent = {
  name: 'guildMemberAdd',
  execute: async (user: GuildMember) => {
    const log = user.guild.channels.cache.get(getConfig().channels.text.log.join) as TextChannel;
    const isBanned = await BansEntity.getBan(user.id);
    const isVmuted = await VmuteEntity.getVmute(user.id);
    const isTmuted = await TmuteEntity.getTmute(user.id);
    const embed = new EmbedBuilder().setDescription(`:door: ${user} зашёл на сервер`);
    if (isBanned) {
      await user.roles.set([getConfig().roles.ban]);
      embed.setFooter({ text: 'Был забанен раннее, выдана роль ban' });
    }
    if (isVmuted) await user.roles.add(getConfig().roles.vmute);
    if (isTmuted) await user.roles.add(getConfig().roles.tmute);
    const invites = (await rest.get(Routes.guildInvites(user.guild.id))) as Invite[];
    let targetInvite;
    for (const i of invites) {
      const currentInvite = client.invites.find((inv) => inv.code == i.code);
      if (currentInvite.uses < i.uses) {
        targetInvite = currentInvite;
      }
    }
    if (targetInvite) {
      embed.addFields(
        { name: 'Инвайт', value: `${targetInvite.code}`, inline: false },
        { name: 'Инвайтер', value: `<@${targetInvite.inviter.id}>`, inline: false },
        { name: 'Инвайт использован', value: `${targetInvite.uses + 1} раз`, inline: false },
      );
    }
    client.invites = invites;
    await log.send({ embeds: [embed] });
  },
};

export default event;
