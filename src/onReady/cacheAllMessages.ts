import { Guild, TextChannel } from 'discord.js';
import { sendErrorLog } from '../utils/sendErrorLog';

export const cacheAllMessages = async (guild: Guild): Promise<void> => {
  const channels = await guild.channels.cache;
  console.log(`Got ${channels.size} channels`);
  for (const channel of channels) {
    if (channel[1].isTextBased && channel[1].type != 4 && channel[1].type != 15) {
      const currentChannel = guild.channels.cache.get(channel[1].id) as TextChannel;
      try {
        await currentChannel.messages.fetch();
      } catch (e) {
        sendErrorLog(e.name, e.message, e);
        console.log(e + `\n Failed to fetch mesages from${currentChannel.name}`);
      }
    }
  }
  console.log('Messages cached. NO ONE WILL ESCAPE!');
};
