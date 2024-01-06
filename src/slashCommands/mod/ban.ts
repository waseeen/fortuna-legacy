import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { BansEntity } from '../../database/Bans.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('ban')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('reason')
        .setNameLocalization('ru', 'причина')
        .setDescription('Причина бана')
        .setRequired(true);
    })
    .setDescription('Выдать бан')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    if (target instanceof GuildMember) {
      if (getConfig().roles.admins.some((roleID) => target.roles.cache.has(roleID)))
        return await interaction.editReply({
          content: 'Кого ты пытаешься забанить? Админа? Не смеши',
        });
      const banRepository = await db.getRepository(BansEntity);
      const isDB = await BansEntity.getBan(target.id);
      if (isDB)
        return await interaction.editReply({
          content: 'У пользователя уже есть бан (DB)',
        });
      const isRole = target.roles.cache.has(getConfig().roles.ban);
      if (isRole)
        return await interaction.editReply({
          content: 'У пользователя уже есть бан (role)',
        });
      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.bans,
      ) as TextChannel;
      // отчет о бане
      const embedLog = new EmbedBuilder()
        .setTitle('Бан')
        .setDescription(`${interaction.user} выдал бан ${target} по причине ${reason}.`)
        .setColor(getConfig().colors.ban_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение о бане таргету
      const embedBan = new EmbedBuilder()
        .setTitle('Пока-пока!')
        .setDescription(
          `Ты получил бан на нашем сервере по причине нарушения правила ${reason}.  Его можно снять, купив разбан в канале <#1141720181551403061>, или дождавшись амнистии.`,
        )
        .setFields({
          name: 'Бан выдал: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\nЕсли хочешь подать апелляцию на разбан,  заполни апелляцию в канале <#1141715954921898046>.`,
        })
        .setColor(getConfig().colors.ban);
      await target.send({ embeds: [embedBan] });

      await target.roles.set([getConfig().roles.ban]);
      const banEntity = banRepository.create({
        user_id: target.id,
      });
      await banEntity.save();
      // сообщение об успешном бане
      return await interaction.editReply({
        content: `Вы выдали бан ${target} по причине: "**${reason}**"`,
      });
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
