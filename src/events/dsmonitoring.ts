import { Message } from 'discord.js';
import { BotEvent } from '../types';
import { getConfig } from '../config/config';
import { UsersEntity } from '../database/Users.entity';
import { sendErrorLog } from '../utils/sendErrorLog';

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    if (message.channel.id === getConfig().channels.text.log.likes) {
      try {
        if (
          message.embeds[0].author?.name === 'Успешно лайкнуто' ||
          message.embeds[0].title === 'Испытайте удачу'
        ) {
          const user = await UsersEntity.getUser(message.embeds[0].footer!.text.slice(17));
          if (!user) return;

          await user.giveCoins(50);
        }
      } catch (e) {
        sendErrorLog(e.name, e.message, e);
      }
    }
  },
};

export default event;
