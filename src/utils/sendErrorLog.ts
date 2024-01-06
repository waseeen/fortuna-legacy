import { client } from '../client';
import { TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { getConfig } from '../config/config';

export const sendErrorLog = async (title: string, text: string, e?): Promise<void> => {
  const embed = new EmbedBuilder().setColor(0xff0000).setTitle(title).setDescription(text);
  if (e) {
    let proto = e;

    try {
      while (proto) {
        const props = Object.getOwnPropertyNames(proto);
        for (const p of props) {
          embed.addFields([{ name: p, value: e[p] }]);
        }
        proto = Object.getPrototypeOf(proto);
      }
    } catch (error) {
      sendErrorLog(error.name, error.message);
    }
  }

  await (client.channels.cache.get(getConfig().channels.text.log.debug) as TextChannel)?.send({
    embeds: [embed],
  });
};
