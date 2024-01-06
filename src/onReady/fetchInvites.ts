import { Guild, Invite, Routes } from 'discord.js';
import { client, rest } from '../client';

export const fetchInvites = async (guild: Guild): Promise<void> => {
  const inv = (await rest.get(Routes.guildInvites(guild.id))) as Invite[];
  client.invites = inv;

  console.log('Invites cached');
};
