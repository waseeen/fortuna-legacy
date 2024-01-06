import { defaultPermissions } from './defaultPermissions';

export const getPermissions = (): typeof defaultPermissions => {
  return defaultPermissions;
};
