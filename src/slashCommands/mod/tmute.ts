import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { TmuteEntity } from '../../database/Tmute.entity';
import moment from 'moment';
import noun from 'plural-ru';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('tmute')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .addIntegerOption((option) => {
      return option
        .setName('duration')
        .setNameLocalization('ru', 'длительность')
        .setDescription('Длительность мута в минутах')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('reason')
        .setNameLocalization('ru', 'причина')
        .setDescription('Причина мута')
        .setRequired(true);
    })
    .setDescription('Наложить текстовый мут')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    if (target instanceof GuildMember) {
      if (getConfig().roles.admins.some((roleID) => target.roles.cache.has(roleID)))
        return await interaction.editReply({
          content: 'Кого ты пытаешься замутить? Админа? Не смеши',
        });

      const duration = interaction.options.getInteger('duration');
      const repository = db.getRepository(TmuteEntity);
      const isDBMuted = await TmuteEntity.getTmute(target.id);
      if (isDBMuted)
        return await interaction.editReply({
          content: 'У пользователя уже есть текстовый мут (DB)',
        });
      const isRoleMuted = target.roles.cache.has(getConfig().roles.tmute);
      if (isRoleMuted)
        return await interaction.editReply({
          content: 'У пользователя уже есть текстовый мут (role)',
        });
      await target.roles.add(getConfig().roles.tmute);

      const unMuteTime = moment().add(duration, 'm');
      const tmuteEntity = repository.create({
        date: unMuteTime.toDate(),
        user_id: target.id,
      });
      await tmuteEntity.save();

      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.tmute,
      ) as TextChannel;
      // отчет о муте
      const sendTime = `${duration} ${noun(duration, 'минуту', 'минуты', 'минут')}`;
      const embedLog = new EmbedBuilder()
        .setTitle('Мут')
        .setDescription(
          `${interaction.user} выдал текстовый мут ${target} на ${sendTime} по причине ${reason}`,
        )
        .setColor(getConfig().colors.mute_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение о муте таргету
      const targetEmbed = new EmbedBuilder()
        .setTitle('Время передохнуть...')
        .setDescription(
          `Ты нарушил правило нашего сервера под номером ${reason}. Теперь ты не сможешь писать в чаты на протяжении ${duration} ${noun(
            duration,
            'минуты',
            'минут',
          )}, но у тебя все еще есть доступ в голосовые каналы! Больше ничего не нарушай <3`,
        )
        .setColor(getConfig().colors.tmute)
        .setFields({
          name: 'Мут выдал: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\nЕсли хочешь обжаловать наказание,  заполни апелляцию в канале <#1141715785358778499>.`,
        });
      await target.send({ embeds: [targetEmbed] });

      // сообщение об успешном муте
      await interaction.editReply({
        content: `Вы выдали текстовый мут ${target} на ${sendTime} по причине: "**${reason}**"`,
      });
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
