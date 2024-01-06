import moment from 'moment';
import { CronJob } from 'cron';
import { TmuteEntity } from '../database/Tmute.entity';
import { getConfig } from '../config/config';
import { client } from '../client';
import { EmbedBuilder } from '@discordjs/builders';
import db from '../connection';

const checkerTMute = async () => {
  const repository = db.getRepository(TmuteEntity);
  const guild = client.guilds.cache.get(getConfig().guild);
  const currentTime = moment();
  const tmutes = await repository.find();
  if (!guild) return;
  for await (const tmute of tmutes) {
    const isTmuteExpired = currentTime.isAfter(tmute.date);
    if (!isTmuteExpired) continue;
    try {
      const member = await guild.members.fetch(tmute.user_id);
      if (member) {
        //mute remove
        await member.roles.remove(getConfig().roles.tmute);
        //mute remove embed to target
        await member.send({
          embeds: [
            new EmbedBuilder().setColor(getConfig().colors.success).setTitle('Срок мута истёк'),
          ],
        });
        await repository.remove(tmute);
      }
    } catch (e) {
      console.log(e);
    }
  }
};

export const tmuteCron = new CronJob('* * * * * *', checkerTMute);
