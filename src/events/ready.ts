import { Client } from 'discord.js';
import { BotEvent } from '../types';
import { getConfig } from '../config/config';
import { setEnv } from '../onReady/setEnv';
import { startCrons } from '../onReady/startCrons';
import { reactionRolesInit } from '../onReady/reactionRolesInit';
import { privateButtonsInit } from '../onReady/privateButtonsInit';
import { cacheAllMessages } from '../onReady/cacheAllMessages';
import { fetchInvites } from '../onReady/fetchInvites';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    console.log(`Bot ready and logged in as ${client.user?.tag}`);
    const guild = client.guilds.cache.get(getConfig().guild);

    await setEnv();
    startCrons();
    await reactionRolesInit(guild);
    await privateButtonsInit(guild);
    await fetchInvites(guild);

    await cacheAllMessages(guild);
  },
};

export default event;
