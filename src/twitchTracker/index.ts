import { CronJob } from 'cron';
import { StreamersEntity } from '../database/Streamers.entity';
import { client } from '../client';
import { getConfig } from '../config/config';
import { TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import db from '../connection';
import moment from 'moment';
import { isLive } from './isLive';

const checker = async () => {
  const channel = client.channels.cache.get(getConfig().channels.text.log.news) as TextChannel;
  const repository = db.getRepository(StreamersEntity);
  const streamers = await repository.find();
  const streamersLog = client.channels.cache.get(
    getConfig().channels.text.log.stream,
  ) as TextChannel;
  for await (const streamer of streamers) {
    const online = await isLive(streamer.twitch_username);
    if (online == streamer.live) continue;
    //if online and was offline
    if (streamer.live == 0) {
      streamer.live = 1;
      await streamer.save();
      const embed = new EmbedBuilder()
        .setTitle('ОМАГАД')
        .setDescription(
          `<@${streamer.user_id}> ЗАПУСТИЛ!!! Бегом на трансляцию 😎😎😎\nhttps://twitch.tv/${streamer.twitch_username}`,
        )
        .setColor(getConfig().colors.twitch)
        .setFooter({ text: 'жесть полная ваще быстрее заходи на стрим' })
        .setImage(
          `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer.twitch_username.toLowerCase()}-400x225.jpg`,
        );
      await channel.send({
        content: `Стрим начался! <@&${getConfig().roles.stream_announce}>`,
        embeds: [embed],
      });
      await streamersLog.send({
        embeds: [
          {
            description: `<@${streamer.user_id}> запустил стрим на канале https://twitch.tv/${
              streamer.twitch_username
            } в [\`${moment().format('HH:mm:ss DD.MM.YYYY')}\`]`,
            color: 53380,
          },
        ],
      });
      continue;
    }
    // if offline and was online
    if (streamer.live == 1) {
      streamer.live = 0;
      await streamer.save();
      await streamersLog.send({
        embeds: [
          {
            description: `<@${streamer.user_id}> закончил стрим на канале https://twitch.tv/${
              streamer.twitch_username
            } в [\`${moment().format('HH:mm:ss DD.MM.YYYY')}\`]`,
            color: 15406156,
          },
        ],
      });
      continue;
    }
  }
};

export const streamersCron = new CronJob('* * * * *', checker);
