import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { UsersEntity } from '../../database/Users.entity';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('uniwarn')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .setDescription('Снять ивент-варн')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    if (target instanceof GuildMember) {
      const user = await UsersEntity.getUser(target.id);
      if (user.iwarns < 1)
        return await interaction.editReply({ content: 'У пользоватея нет ивент-варнов' });
      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.iwarns,
      ) as TextChannel;
      // отчет о варне
      const embedLog = new EmbedBuilder()
        .setTitle('Ивент-варн снят')
        .setDescription(`${interaction.user} снял ивент-варн ${target}`)
        .setColor(getConfig().colors.warn_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение об успешном варне
      await interaction.editReply({
        content: `Вы сняли ивент-варн ${target}`,
      });
      // сообщение о варне таргету
      const embedWarn = new EmbedBuilder()
        .setTitle('Минус ивент-варн!')
        .setFields({
          name: 'Ивент-варн снял: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\n`,
        })
        .setColor(getConfig().colors.warn);
      user.iwarns = user.iwarns - 1;
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
