import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { VmuteEntity } from '../../database/Vmute.entity';
import moment from 'moment';
import noun from 'plural-ru';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('vmute')
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
    .setDescription('Наложить голосовой мут')
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
      const repository = db.getRepository(VmuteEntity);
      const isDBMuted = await VmuteEntity.getVmute(target.id);
      if (isDBMuted)
        return await interaction.editReply({
          content: 'У пользователя уже есть голосовой мут (DB)',
        });
      const isRoleMuted = target.roles.cache.has(getConfig().roles.vmute);
      if (isRoleMuted)
        return await interaction.editReply({
          content: 'У пользователя уже есть голосовой мут (role)',
        });
      await target.roles.add(getConfig().roles.vmute);

      const unMuteTime = moment().add(duration, 'm');
      const vmuteEntity = repository.create({
        date: unMuteTime.toDate(),
        user_id: target.id,
      });
      await vmuteEntity.save();

      await target.voice?.setChannel(null);

      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.vmute,
      ) as TextChannel;
      // отчет о муте
      const sendTime = `${duration} ${noun(duration, 'минуту', 'минуты', 'минут')}`;
      const embedLog = new EmbedBuilder()
        .setTitle('Мут')
        .setDescription(
          `${interaction.user} выдал голосовой мут ${target} на ${sendTime} по причине ${reason}`,
        )
        .setColor(getConfig().colors.mute_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение о муте таргету
      const targetEmbed = new EmbedBuilder()
        .setTitle('Время передохнуть...')
        .setDescription(
          `Ты нарушил правило нашего сервера под номером ${reason}. Теперь ты не сможешь заходить в голосовые каналы на протяжении ${duration} ${noun(
            duration,
            'минуты',
            'минут',
          )}, но у тебя все еще есть доступ в чаты! Больше ничего не нарушай <3`,
        )
        .setColor(getConfig().colors.vmute)
        .setFields({
          name: 'Мут выдал: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\nЕсли хочешь обжаловать наказание,  заполни апелляцию в канале <#1141715785358778499>.`,
        });
      await target.send({ embeds: [targetEmbed] });

      // сообщение об успешном муте
      await interaction.editReply({
        content: `Вы выдали голосовой мут ${target} на ${sendTime} по причине: "**${reason}**"`,
      });
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
