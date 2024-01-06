import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { UsersEntity } from '../../database/Users.entity';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('unwarn')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .setDescription('Снять варн')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    if (target instanceof GuildMember) {
      const user = await UsersEntity.getUser(target.id);
      if (user.warns < 1)
        return await interaction.editReply({ content: 'У пользоватея нет варнов' });
      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.warns,
      ) as TextChannel;
      // отчет о варне
      const embedLog = new EmbedBuilder()
        .setTitle('Варн снят')
        .setDescription(`${interaction.user} снял варн ${target}`)
        .setColor(getConfig().colors.warn_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение об успешном варне
      await interaction.editReply({
        content: `Вы сняли варн ${target}`,
      });
      // сообщение о варне таргету
      const embedWarn = new EmbedBuilder()
        .setTitle('Минус варн!')
        .setFields({
          name: 'Варн снял: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\n`,
        })
        .setColor(getConfig().colors.warn);
      user.warns = user.warns - 1;
      await user.save();
      await target.send({ embeds: [embedWarn] });
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
