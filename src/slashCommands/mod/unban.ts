import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { BansEntity } from '../../database/Bans.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('unban')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .setDescription('Снять бан')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    if (target instanceof GuildMember) {
      const repository = db.getRepository(BansEntity);
      const isDBbanned = await BansEntity.getBan(target.id);
      const isRoleBanned = target.roles.cache.has(getConfig().roles.ban);
      if (!isDBbanned && !isRoleBanned)
        return interaction.editReply({ content: 'У пользоватея нет бана' });
      if (isDBbanned) {
        await repository.delete(isDBbanned.user_id);
      }
      await target.roles.remove(getConfig().roles.ban);

      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.bans,
      ) as TextChannel;
      // отчет о разбане
      const embedLog = new EmbedBuilder()
        .setTitle('Разбан')
        .setDescription(`${interaction.user} снял бан ${target}`)
        .setColor(getConfig().colors.ban_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение о разбане таргету
      const targetEmbed = new EmbedBuilder()
        .setTitle('Возрадуйся!')
        .setDescription('Добрый человек разбанил тебя!')
        .setColor(getConfig().colors.ban)
        .setFields({
          name: 'Бан снял: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).`,
        });
      await target.send({ embeds: [targetEmbed] });

      // сообщение об успешном разбане
      await interaction.editReply({
        content: `Вы сняли бан ${target}`,
      });
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
