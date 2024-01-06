import { Invite } from 'discord.js';
import { BotEvent } from '../types';
import { client } from '../client';

const event: BotEvent = {
  name: 'inviteCreate',
  execute: async (invite: Invite) => {
    client.invites.push(invite);
  },
};

export default event;
