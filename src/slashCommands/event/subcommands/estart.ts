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
import { EventsEntity } from '../../../database/Events.entity';
import db from '../../../connection';

export const estart = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });
  if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
  const eventOption = interaction.options.getString('type');
  const eventer = interaction.user;
  const repository = db.getRepository(EventsEntity);
  const dateNow = new Date();
  const isEvent = await EventsEntity.getEvent(eventer.id);
  if (isEvent) return await interaction.editReply({ content: 'У вас уже есть активный ивент' });
  const event = getEvents().events.find((e) => {
    return e.value === eventOption;
  });
  if (!event) return await interaction.editReply({ content: 'Ивента такого типа не существует' });
  const defaultEventsCategory = interaction.guild.channels.cache.get(
    getConfig().channels.categories.defaultEvents,
  ) as CategoryChannel;
  const eventCategory = await interaction.guild.channels.create({
    type: ChannelType.GuildCategory,
    name: `${event.name} | ${eventer.username}`,
    position: defaultEventsCategory.position,
    permissionOverwrites: [
      {
        id: getConfig().roles.eventer,
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
  const eventText = await interaction.guild.channels.create({
    type: ChannelType.GuildText,
    name: `${event.name}`,
    parent: eventCategory,
  });
  const eventVoice = await interaction.guild.channels.create({
    type: ChannelType.GuildVoice,
    name: `${event.name} | ${eventer.displayName}`,
    parent: eventCategory,
  });

  const announceChannel = interaction.guild.channels.cache.get(
    getConfig().channels.text.events,
  ) as TextChannel;
  const embedAnnounce = new EmbedBuilder()
    .setTitle(event.name)
    .setDescription(
      `Ивент проводит <@${eventer.id}>\n${
        event.description ? event.description : ''
      }\nВойс ивента: <#${eventVoice.id}>\nЧат ивента: <#${eventText.id}>`,
    );
  if (event.image) embedAnnounce.setImage(event.image);
  const announceMsg = await announceChannel.send({ embeds: [embedAnnounce] });
  const eventLog = interaction.guild.channels.cache.get(
    getConfig().channels.text.log.events,
  ) as TextChannel;
  const logEmbed = new EmbedBuilder()
    .setTitle('Ивент создан')
    .addFields(
      { name: 'Ивент', value: `${event.name}` },
      { name: 'Ивентёр', value: `<@${eventer.id}>` },
    )
    .setFooter({ text: `Время запуска ивента: ${dateNow.toLocaleString('ru-RU')}` });
  const logMsg = await eventLog.send({ embeds: [logEmbed] });
  const newEvent = repository.create({
    user_id: eventer.id,
    category_id: eventCategory.id,
    start: dateNow,
    name: event.value,
    announce_id: announceMsg.id,
    log_id: logMsg.id,
  });

  await newEvent.save();
  return await interaction.editReply({ content: 'Ивент успешно создан' });
};
