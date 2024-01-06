import { CategoryChannel, ChannelType, PermissionsBitField, TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Button } from '../types';
import { getConfig } from '../config/config';
import db from '../connection';
import { getEvents } from '../config/events';
import { ClosesEntity } from '../database/Closes.entity';

const event: Button = {
  id: 'takeClose',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const closeOption = embed.footer.text;
    const closer = interaction.user;
    if (!interaction.guild.members.cache.get(closer.id).roles.cache.has(getConfig().roles.closer))
      return await interaction.reply({ content: 'Ты не клозер', ephemeral: true });
    const repository = db.getRepository(ClosesEntity);
    const dateNow = new Date();
    const isClose = await ClosesEntity.getClose(closer.id);
    if (isClose)
      return await interaction.reply({ content: 'У вас уже есть активный клоз', ephemeral: true });
    const close = getEvents().closes.find((c) => {
      return c.value === closeOption;
    });
    if (!close)
      return await interaction.reply({
        content: 'Клоза такого типа не существует',
        ephemeral: true,
      });

    const newEmbed = new EmbedBuilder(embed)
      .addFields({
        name: 'Клоз начал',
        value: `${closer}`,
      })
      .setColor(0x57f287);
    await interaction.message.edit({ embeds: [newEmbed], components: [] });
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
    return await interaction.reply({ content: 'Вы начали клоз', ephemeral: true });
  },
};

export default event;
