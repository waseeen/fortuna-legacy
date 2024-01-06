import {
  CategoryChannel,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { getConfig } from '../../../config/config';
import { EventsEntity } from '../../../database/Events.entity';
import { getEvents } from '../../../config/events';
import noun from 'plural-ru';
import db from '../../../connection';

export const eend = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });
  const eventer = interaction.user;
  const repository = db.getRepository(EventsEntity);
  const dateNow = new Date();
  const isEvent = await EventsEntity.getEvent(eventer.id);
  if (!isEvent) return interaction.editReply({ content: 'У вас нет активного ивента' });
  const event = getEvents().events.find((e) => {
    return e.value === isEvent.name;
  });
  const category = interaction.guild.channels.cache.get(isEvent.category_id) as CategoryChannel;
  for (const channel of category.children.cache) {
    await channel[1].delete();
  }
  await category.delete();
  const duration = Math.ceil((dateNow.getTime() - isEvent.start.getTime()) / 1000 / 60);
  const durationRus = noun(duration, 'минуту', 'минуты', 'минут');
  const eventLog = interaction.guild.channels.cache.get(
    getConfig().channels.text.log.events,
  ) as TextChannel;
  const announceChannel = interaction.guild.channels.cache.get(
    getConfig().channels.text.events,
  ) as TextChannel;
  const logEmbed = new EmbedBuilder()
    .setTitle('Ивент закончен')
    .addFields(
      { name: 'Ивент', value: `${event.name}` },
      { name: 'Ивентёр', value: `<@${eventer.id}>` },
      {
        name: 'Ивент продлился',
        value: `${duration} ${durationRus}`,
      },
    )
    .setFooter({ text: `Время окончания ивента: ${dateNow.toLocaleString('ru-RU')}` });
  const logMsg = await eventLog.messages.fetch(isEvent.log_id);
  if (logMsg) {
    await logMsg.edit({ embeds: [logEmbed] });
  } else {
    eventLog.send({ embeds: [logEmbed] });
  }
  const announceMsg = await announceChannel.messages.fetch(isEvent.announce_id);
  const embedAnnounce = new EmbedBuilder()
    .setTitle(event.name + ' (Окончен)')
    .setDescription(
      `Ивент провёл <@${isEvent.user_id}>\n${event.description ? event.description : ''}`,
    );
  if (event.image) embedAnnounce.setImage(event.image);
  if (announceMsg) await announceMsg.edit({ embeds: [embedAnnounce] });
  repository.delete(isEvent.user_id);
  return interaction.editReply({ content: 'Ивент успешно закончен' });
};
