import { ButtonStyle, Guild, GuildTextBasedChannel } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { getConfig } from '../config/config';

export const privateButtonsInit = async (guild: Guild): Promise<void> => {
  const privateManageChannel = guild.channels.cache.get(
    getConfig().private.manageChannel,
  ) as GuildTextBasedChannel;
  const privateMessage = await privateManageChannel.messages.fetch(getConfig().private.message);

  const privateName = new ButtonBuilder()
    .setCustomId('privateName')
    .setLabel('✒')
    .setStyle(ButtonStyle.Secondary);

  const privateLimit = new ButtonBuilder()
    .setCustomId('privateLimit')
    .setLabel('👩‍👩‍👧‍👦')
    .setStyle(ButtonStyle.Secondary);

  const rowOne = new ActionRowBuilder<ButtonBuilder>().addComponents(privateName, privateLimit); //name, limit

  const privateLock = new ButtonBuilder()
    .setCustomId('privateLock')
    .setLabel('🔒')
    .setStyle(ButtonStyle.Secondary);

  const privateUnlock = new ButtonBuilder()
    .setCustomId('privateUnlock')
    .setLabel('🔓')
    .setStyle(ButtonStyle.Secondary);

  const rowTwo = new ActionRowBuilder<ButtonBuilder>().addComponents(privateLock, privateUnlock); //lock, unlock

  const privateAddMember = new ButtonBuilder()
    .setCustomId('privateAddMember')
    .setLabel('➕')
    .setStyle(ButtonStyle.Secondary);

  const privateRemoveMember = new ButtonBuilder()
    .setCustomId('privateRemoveMember')
    .setLabel('➖')
    .setStyle(ButtonStyle.Secondary);

  const rowThree = new ActionRowBuilder<ButtonBuilder>().addComponents(
    privateAddMember,
    privateRemoveMember,
  ); //adduser, removeuser

  await privateMessage.edit({
    embeds: [
      {
        title: 'Приватные комнаты',
        description:
          'Для создания приватной комнаты зайдите в канал <#1158441951322964028>\nУправление приватом:\n"✒" - для изменения названия привата\n"👩‍👩‍👧‍👦" - для изменения лимита на количество пользователей в привате\n"🔒" - запретить всем пользователям вход в приват \n"🔓" - разрешить всем пользователям вход в приват\n"➕" - разрешить конкретному пользователю вход в приват\n"➖" - запретить конкретному пользователю вход в приват и выгнать его, если он сейчас находится в нём',
        color: 53380,
      },
    ],
    components: [rowOne, rowTwo, rowThree],
  });
  console.log('Private buttons updated');
};
