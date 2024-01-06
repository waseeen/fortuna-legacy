import { TextChannel, VoiceState } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { BotEvent } from '../types';
import { getConfig } from '../config/config';
import moment from 'moment';

const event: BotEvent = {
  name: 'voiceStateUpdate',
  execute: async (oldVoice: VoiceState, newVoice: VoiceState) => {
    if (newVoice.channel === oldVoice.channel) return;
    const date = moment().format('HH:mm:ss DD.MM.YYYY');
    const voiceLog = newVoice.guild.channels.cache.get(
      getConfig().channels.text.log.voice,
    ) as TextChannel;
    const embed = new EmbedBuilder();
    if (!newVoice.channel && oldVoice.channel) {
      embed
        .setDescription(
          `:no_pedestrians: Участник ${oldVoice.member} ID: ${oldVoice.id} вышел из канала <#${oldVoice.channel.id}> [\`${date}\`]`,
        )
        .setColor(0xed4245);
    }
    if (newVoice.channel && !oldVoice.channel) {
      embed
        .setDescription(
          `:door: Участник ${newVoice.member} ID: ${newVoice.id} зашёл в канал <#${newVoice.channel.id}> [\`${date}\`]`,
        )
        .setColor(0x57f287);
    }
    if (newVoice.channel && oldVoice.channel) {
      embed
        .setDescription(
          `:rocket: Участник ${newVoice.member} ID: ${newVoice.id}
        переместился из канала <#${oldVoice.channel.id}> в <#${newVoice.channel.id}> [\`${date}\`]`,
        )
        .setColor(0x3498db);
    }
    await voiceLog.send({ embeds: [embed] });
    if (newVoice.member.roles.cache.has(getConfig().roles.vmute))
      await newVoice.member.voice.setChannel(null);
  },
};

export default event;
