import { SettingsEntity } from '../database/Settings.entity';

export const setEnv = async (): Promise<void> => {
  const bearerToken = await SettingsEntity.getStreamer('twitch_bearer');
  process.env.TWITCH_BEARER = bearerToken.value;
  console.log('Twitch token was successfully set');
};
