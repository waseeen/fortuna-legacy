import {
  CategoryChannel,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  TextChannel,
} from 'discord.js';
import { getEvents } from '../../../config/events';
import { getConfig } from '../../../config/config';
import { ClosesEntity } from '../../../database/Closes.entity';
import db from '../../../connection';

export const cstart = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });
  if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
  const closeOption = interaction.options.getString('type');
  const closer = interaction.user;
  const repository = db.getRepository(ClosesEntity);
  const dateNow = new Date();
  const isClose = await ClosesEntity.getClose(closer.id);
  if (isClose) return await interaction.editReply({ content: 'У вас уже есть активный клоз' });
  const close = getEvents().closes.find((c) => {
    return c.value === closeOption;
  });
  if (!close) return await interaction.editReply({ content: 'Клоза такого типа не существует' });
  const defaultEventsCategory = interaction.guild.channels.cache.get(
    getConfig().channels.categories.defaultEvents,
  ) as CategoryChannel;
  const closeCategory = await interaction.guild.channels.create({
    type: ChannelType.GuildCategory,
    name: `${close.name} | ${closer.username}`,
    position: defaultEventsCategory.position,
    permissionOverwrites: [
      {
        id: getConfig().roles.closer,
        allow: [
          PermissionsBitField.Flags.MoveMembers,
          PermissionsBitField.Flags.MuteMembers,
          PermissionsBitField.Flags.DeafenMembers,
          PermissionsBitField.Flags.ManageChannels,
          PermissionsBitField.Flags.ManageMessages,
          PermissionsBitField.Flags.ManageRoles,
        ],
      },
      {
        id: getConfig().roles.iban,
        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.SendMessages],
      },
    ],
  });
  const closeText = await interaction.guild.channels.create({
    type: ChannelType.GuildText,
    name: `${close.name}`,
    parent: closeCategory,
  });
  const closeVoice = await interaction.guild.channels.create({
    type: ChannelType.GuildVoice,
    name: `${close.name} | ${closer.displayName}`,
    parent: closeCategory,
  });

  const announceChannel = interaction.guild.channels.cache.get(
    getConfig().channels.text.closes,
  ) as TextChannel;
  const embedAnnounce = new EmbedBuilder()
    .setTitle(close.name)
    .setDescription(
      `Клоз проводит <@${closer.id}>\n${
        close.description ? close.description : ''
      }\nВойс клоза: <#${closeVoice.id}>\nЧат клоза: <#${closeText.id}>`,
    );
  if (close.image) embedAnnounce.setImage(close.image);
  const announceMsg = await announceChannel.send({ embeds: [embedAnnounce] });
  const closeLog = interaction.guild.channels.cache.get(
    getConfig().channels.text.log.closes,
  ) as TextChannel;
  const logEmbed = new EmbedBuilder()
    .setTitle('Клоз создан')
    .addFields(
      { name: 'Клоз', value: `${close.name}` },
      { name: 'Клозер', value: `<@${closer.id}>` },
    )
    .setFooter({ text: `Время запуска клоза: ${dateNow.toLocaleString('ru-RU')}` });
  const logMsg = await closeLog.send({ embeds: [logEmbed] });
  const newClose = repository.create({
    user_id: closer.id,
    category_id: closeCategory.id,
    start: dateNow,
    name: close.value,
    announce_id: announceMsg.id,
    log_id: logMsg.id,
  });

  await newClose.save();
  return await interaction.editReply({ content: 'Клоз успешно создан' });
};
