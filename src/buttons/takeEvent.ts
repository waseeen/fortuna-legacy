import { CategoryChannel, ChannelType, PermissionsBitField, TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Button } from '../types';
import { getConfig } from '../config/config';
import db from '../connection';
import { EventsEntity } from '../database/Events.entity';
import { getEvents } from '../config/events';

const event: Button = {
  id: 'takeEvent',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const eventOption = embed.footer.text;
    const eventer = interaction.user;
    if (!interaction.guild.members.cache.get(eventer.id).roles.cache.has(getConfig().roles.eventer))
      return await interaction.reply({ content: 'Ты не ивентер', ephemeral: true });
    const repository = db.getRepository(EventsEntity);
    const dateNow = new Date();
    const isEvent = await EventsEntity.getEvent(eventer.id);
    if (isEvent)
      return await interaction.reply({ content: 'У вас уже есть активный ивент', ephemeral: true });
    const event = getEvents().events.find((e) => {
      return e.value === eventOption;
    });
    if (!event)
      return await interaction.reply({
        content: 'Ивента такого типа не существует',
        ephemeral: true,
      });

    const newEmbed = new EmbedBuilder(embed)
      .addFields({
        name: 'Ивент начал',
        value: `${eventer}`,
      })
      .setColor(0x57f287);
    await interaction.message.edit({ embeds: [newEmbed], components: [] });
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
    return await interaction.reply({ content: 'Вы начали ивент', ephemeral: true });
  },
};

export default event;
