import { Guild, GuildTextBasedChannel } from 'discord.js';
import { getConfig } from '../config/config';

export const reactionRolesInit = async (guild: Guild): Promise<void> => {
  const reactionsChannel = guild.channels.cache.get(
    getConfig().reactionRoles.channel,
  ) as GuildTextBasedChannel;
  const reactionsMessage = await reactionsChannel.messages.fetch(getConfig().reactionRoles.message);
  const reactions = getConfig().reactionRoles.roles;
  for (const reaction in reactions) {
    await reactionsMessage.react(reaction);
  }
  console.log('Reaction roles initiated');
};
