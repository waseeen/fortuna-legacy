import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { UsersEntity } from '../../database/Users.entity';
import noun from 'plural-ru';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('profile')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(false);
    })
    .setDescription('Просмотреть свой профиль / профиль указанного пользователя'),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    let target = interaction.options.getUser('user');
    if (!target) target = interaction.user;
    const profile = await UsersEntity.getUser(target.id);
    const balanceRus = noun(profile.coins, 'голда', 'голды', 'голды');
    const embedProfile = new EmbedBuilder()
      .setTitle(`Профиль ${target.username}`)
      .addFields(
        { name: 'Голда', value: `${profile.coins} ${balanceRus}` },
        { name: 'Время в войсе', value: `${profile.voice_time / 60} минут` },
        { name: 'Варны', value: `${profile.warns}` },
        { name: 'Ивент-варны', value: `${profile.iwarns}` },
      );
    await interaction.editReply({ embeds: [embedProfile] });
  },
};

export default command;
