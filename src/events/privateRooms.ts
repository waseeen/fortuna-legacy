import { ChannelType, PermissionsBitField, VoiceState } from 'discord.js';
import { BotEvent } from '../types';
import { getConfig } from '../config/config';

const event: BotEvent = {
  name: 'voiceStateUpdate',
  execute: async (oldVoice: VoiceState, newVoice: VoiceState) => {
    if (newVoice.channel === oldVoice.channel) return;

    if (newVoice.channelId == getConfig().private.create) {
      const newPrivate = await newVoice.guild.channels.create({
        type: ChannelType.GuildVoice,
        name: `${newVoice.member.nickname} | приват`,
        parent: getConfig().private.category,
        permissionOverwrites: [
          {
            id: newVoice.member.id,
            allow: [
              PermissionsBitField.Flags.MoveMembers,
              PermissionsBitField.Flags.MuteMembers,
              PermissionsBitField.Flags.DeafenMembers,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.ManageMessages,
            ],
          },
          {
            id: newVoice.guild.id,
            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.SendMessages],
          },
          {
            id: getConfig().roles.vmute,
            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.SendMessages],
          },
        ],
      });
      newVoice.member.voice.setChannel(newPrivate);
    }
    if (
      oldVoice.channel?.parentId === getConfig().private.category &&
      oldVoice.channel!.id !== getConfig().private.create &&
      oldVoice.channel!.members.size === 0
    ) {
      oldVoice.channel!.delete().catch(() => {});
    }
  },
};

export default event;
