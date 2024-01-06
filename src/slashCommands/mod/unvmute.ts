import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { VmuteEntity } from '../../database/Vmute.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('unvmute')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .setDescription('Снять голосовой мут')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    if (target instanceof GuildMember) {
      const repository = db.getRepository(VmuteEntity);
      const isDBMuted = await VmuteEntity.getVmute(target.id);
      if (isDBMuted) {
        await repository.delete(isDBMuted.user_id);
      }
      await target.roles.remove(getConfig().roles.vmute);

      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.vmute,
      ) as TextChannel;
      // отчет о муте
      const embedLog = new EmbedBuilder()
        .setTitle('Мут')
        .setDescription(`${interaction.user} снял голосовой мут ${target}`)
        .setColor(getConfig().colors.mute_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение о муте таргету
      const targetEmbed = new EmbedBuilder()
        .setTitle('Возрадуйся!')
        .setDescription('Добрый человек снял тебе голосовой мут!')
        .setColor(getConfig().colors.vmute)
        .setFields({
          name: 'Мут снял: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).`,
        });
      await target.send({ embeds: [targetEmbed] });

      // сообщение об успешном муте
      await interaction.editReply({
        content: `Вы сняли голосовой мут ${target}`,
      });
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
