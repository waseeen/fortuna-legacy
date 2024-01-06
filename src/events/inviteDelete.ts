import { Invite } from 'discord.js';
import { BotEvent } from '../types';
import { client } from '../client';

const event: BotEvent = {
  name: 'inviteDelete',
  execute: async (invite: Invite) => {
    client.invites = client.invites.filter((i) => i !== invite);
  },
};

export default event;
