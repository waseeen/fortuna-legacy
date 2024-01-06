import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { TmuteEntity } from '../../database/Tmute.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('untmute')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .setDescription('Снять текстовый мут')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    if (target instanceof GuildMember) {
      const repository = db.getRepository(TmuteEntity);
      const isDBMuted = await TmuteEntity.getTmute(target.id);
      if (isDBMuted) {
        await repository.delete(isDBMuted.user_id);
      }
      await target.roles.remove(getConfig().roles.tmute);

      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.tmute,
      ) as TextChannel;
      // отчет о муте
      const embedLog = new EmbedBuilder()
        .setTitle('Мут')
        .setDescription(`${interaction.user} снял текстовый мут ${target}`)
        .setColor(getConfig().colors.mute_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение о муте таргету
      const targetEmbed = new EmbedBuilder()
        .setTitle('Возрадуйся!')
        .setDescription('Добрый человек снял тебе текстовый мут!')
        .setColor(getConfig().colors.tmute)
        .setFields({
          name: 'Мут снял: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).`,
        });
      await target.send({ embeds: [targetEmbed] });

      // сообщение об успешном муте
      await interaction.editReply({
        content: `Вы сняли текстовый мут ${target}`,
      });
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
