import { ApplicationCommandPermissionType } from 'discord.js';
import { getConfig } from './config';

export const defaultPermissions = {
  commands: {
    close: [
      {
        id: getConfig().roles.closer,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    event: [
      {
        id: getConfig().roles.eventer,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    profile: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
    ],
    streamers: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
    ],
    embed: [
      {
        id: getConfig().roles.embed,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    embededit: [
      {
        id: getConfig().roles.embed,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    ban: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    unban: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    tmute: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    untmute: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    vmute: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    unvmute: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    warn: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    unwarn: [
      {
        id: getConfig().roles.moderator,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.jrAdmin,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    setperms: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    addstreamer: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    removestreamer: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    iwarn: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
      {
        id: getConfig().roles.eventer,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.closer,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
    ],
    uniwarn: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
      {
        id: getConfig().roles.eventer,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
      {
        id: getConfig().roles.closer,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
    ],
    report: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
    ],
    request: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: true,
      },
    ],
    protectinvite: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
    googleupdate: [
      {
        id: getConfig().guild,
        type: ApplicationCommandPermissionType.Role,
        permission: false,
      },
    ],
  },
};
