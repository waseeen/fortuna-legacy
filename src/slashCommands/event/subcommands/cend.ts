import {
  CategoryChannel,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { getConfig } from '../../../config/config';
import { ClosesEntity } from '../../../database/Closes.entity';
import { getEvents } from '../../../config/events';
import noun from 'plural-ru';
import db from '../../../connection';

export const cend = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });
  const closer = interaction.user;
  const repository = db.getRepository(ClosesEntity);
  const dateNow = new Date();
  const isClose = await ClosesEntity.getClose(closer.id);
  if (!isClose) return interaction.editReply({ content: 'У вас нет активного клоза' });
  const close = getEvents().closes.find((c) => {
    return c.value === isClose.name;
  });
  const category = interaction.guild.channels.cache.get(isClose.category_id) as CategoryChannel;
  for (const channel of category.children.cache) {
    await channel[1].delete();
  }
  await category.delete();
  const duration = Math.ceil((dateNow.getTime() - isClose.start.getTime()) / 1000 / 60);
  const durationRus = noun(duration, 'минуту', 'минуты', 'минут');
  const closeLog = interaction.guild.channels.cache.get(
    getConfig().channels.text.log.closes,
  ) as TextChannel;
  const announceChannel = interaction.guild.channels.cache.get(
    getConfig().channels.text.closes,
  ) as TextChannel;
  const logEmbed = new EmbedBuilder()
    .setTitle('Клоз закончен')
    .addFields(
      { name: 'Клоз', value: `${close.name}` },
      { name: 'Клозер', value: `<@${closer.id}>` },
      {
        name: 'Клоз продлился',
        value: `${duration} ${durationRus}`,
      },
    )
    .setFooter({ text: `Время окончания клоза: ${dateNow.toLocaleString('ru-RU')}` });
  const logMsg = await closeLog.messages.fetch(isClose.log_id);
  if (logMsg) {
    await logMsg.edit({ embeds: [logEmbed] });
  } else {
    closeLog.send({ embeds: [logEmbed] });
  }
  const announceMsg = await announceChannel.messages.fetch(isClose.announce_id);
  const embedAnnounce = new EmbedBuilder()
    .setTitle(close.name + ' (Окончен)')
    .setDescription(
      `Клоз провёл <@${isClose.user_id}>\n${close.description ? close.description : ''}`,
    );
  if (close.image) embedAnnounce.setImage(close.image);
  if (announceMsg) await announceMsg.edit({ embeds: [embedAnnounce] });
  repository.delete(isClose.user_id);
  return interaction.editReply({ content: 'Клоз успешно закончен' });
};
