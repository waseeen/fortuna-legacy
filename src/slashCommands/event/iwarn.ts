import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { UsersEntity } from '../../database/Users.entity';
import noun from 'plural-ru';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('iwarn')
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
        .setDescription('Причина ивент-варна')
        .setRequired(true);
    })
    .setDescription('Выдать ивент-варн')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    if (target instanceof GuildMember) {
      const user = await UsersEntity.getUser(target.id);
      user.iwarns = user.iwarns + 1;
      await user.save();
      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.iwarns,
      ) as TextChannel;
      // отчет о варне
      const embedLog = new EmbedBuilder()
        .setTitle('Ивент-варн')
        .setDescription(`${interaction.user} выдал ивент-варн ${target} по причине ${reason}.`)
        .setColor(getConfig().colors.warn_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение об успешном варне
      await interaction.editReply({
        content: `Вы выдали ивент-варн ${target} по причине: "**${reason}**"`,
      });
      // сообщение о варне таргету
      const iwarnRus = noun(user.iwarns, 'ивент-варн', 'ивент-варна', 'ивент-варнов');
      const embediWarn = new EmbedBuilder();
      embediWarn
        .setTitle('Лови ивент-варн!')
        .setFields({
          name: 'Ивент-варн выдал: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\n`,
        })
        .setColor(getConfig().colors.warn)
        .setDescription(
          `У тебя ${user.iwarns} ${iwarnRus}. При получении трёх ивент-варнов ты получишь бан на ивенты и клозы`,
        );
      await target.send({ embeds: [embediWarn] });
      if (user.iwarns >= 3) {
        await target.roles.add(getConfig().roles.iban);
        const ibanLog = new EmbedBuilder()
          .setTitle('Ивент-бан')
          .setDescription(`${target} получил ивент-бан за три ивент-варна`)
          .setColor(getConfig().colors.warn_log);
        await channel.send({ embeds: [ibanLog] });
      }
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
