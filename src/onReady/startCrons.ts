import { inviteCleaner } from '../cron/inviteCleaner';
import { tmuteCron } from '../cron/tmuteCron';
import { vmuteCron } from '../cron/vmuteCron';
import { voiceCron } from '../cron/voiceCron';
import { streamersCron } from '../twitchTracker';

export const startCrons = () => {
  vmuteCron.start();
  tmuteCron.start();
  voiceCron.start();
  streamersCron.start();
  inviteCleaner.start();
  console.log('Crons started');
};
