import { streamersCron } from '.';
import { sendErrorLog } from '../utils/sendErrorLog';

export const isLive = async (twitch_name): Promise<number> => {
  const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${twitch_name}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.TWITCH_BEARER,
      'Client-ID': process.env.TWITCH_CLIENT_ID,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((e) => {
      sendErrorLog('Twitch fetch failed. ', e.name);
    });
  if (res?.status == '401') {
    await sendErrorLog('Twitch token expired', 'To claim new token run /twitchtokenupdate');
    streamersCron.stop();
    return 0;
  }
  if (!res.data) return 0;
  if (res?.data[0]?.type == 'live') return 1;
  return 0;
};
