import { getConfig } from '../config/config';
import { client } from '../client';
import { CronJob } from 'cron';
import { InviteEntity } from '../database/Invites.entity';
import { docUpdate } from '../utils/docUpdate';

const inviteNightly = async () => {
  for (const invite of client.invites) {
    const isProtected = await InviteEntity.getInvite(invite.code);
    if (invite.uses < 10 && !isProtected) {
      await client.guilds.cache.get(getConfig().guild).invites.delete(invite.code).catch();
    }
  }
  await docUpdate();
};

export const inviteCleaner = new CronJob('0 0 * * *', inviteNightly);
