import moment from 'moment';
import { CronJob } from 'cron';
import { VmuteEntity } from '../database/Vmute.entity';
import { getConfig } from '../config/config';
import { client } from '../client';
import { EmbedBuilder } from '@discordjs/builders';
import db from '../connection';
import { sendErrorLog } from '../utils/sendErrorLog';

const checkerVMute = async () => {
  const repository = db.getRepository(VmuteEntity);
  const guild = client.guilds.cache.get(getConfig().guild);
  const currentTime = moment();
  const vmutes = await repository.find();
  if (!guild) return;
  for await (const vmute of vmutes) {
    const isVmuteExpired = currentTime.isAfter(vmute.date);
    const member = await guild.members.fetch(vmute.user_id);
    if (!isVmuteExpired) {
      try {
        await member.voice?.setChannel(null);
        await member.roles.add(getConfig().roles.vmute);
      } catch (e) {
        console.log(e);
        sendErrorLog(e.name, e.message, e);
      }
    } else {
      try {
        if (member) {
          //mute remove
          await member.roles.remove(getConfig().roles.vmute);
          //mute remove embed to target
          await member.send({
            embeds: [
              new EmbedBuilder().setColor(getConfig().colors.success).setTitle('Срок мута истёк'),
            ],
          });
          await repository.remove(vmute);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};

export const vmuteCron = new CronJob('* * * * * *', checkerVMute);
