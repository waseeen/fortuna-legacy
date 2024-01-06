import { getConfig } from '../config/config';
import { client } from '../client';
import { CronJob } from 'cron';
import { UsersEntity } from '../database/Users.entity';
import db from '../connection';

const checkerVoice = async () => {
  const userRepository = db.getRepository(UsersEntity);
  const guild = client.guilds.cache.get(getConfig().guild);

  const channels = (await guild.channels.fetch()).filter(
    (channel) => channel.type === 2 && channel.id !== getConfig().channels.voice.afk,
  );

  channels.forEach(async (channel) => {
    await guild.channels.fetch(channel.id);
    const members = channel.members;
    members.forEach(async (member) => {
      const guildmember = await guild.members.fetch(member.id);
      UsersEntity.getUser(member.id)
        .then(async (user) => {
          if (!guildmember.voice.deaf && guildmember.voice.id != getConfig().channels.voice.afk) {
            user.coins += 1;
            user.voice_time += 60;
          }
          await userRepository.save(user).catch();
        })
        .catch();
    });
  });
};

export const voiceCron = new CronJob('* * * * *', checkerVoice);
