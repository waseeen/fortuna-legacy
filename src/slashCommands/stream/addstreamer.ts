import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { StreamersEntity } from '../../database/Streamers.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('addstreamer')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('twitch_nickname')
        .setNameLocalization('ru', 'никнейм')
        .setDescription('Никнейм стримера на твиче')
        .setRequired(true);
    })
    .setDescription('Добавить нового пользователя в список стримеров')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });

    const repository = await db.getRepository(StreamersEntity);
    const ttv = interaction.options.getString('twitch_nickname');
    const target = interaction.options.getUser('user');
    const isStreamer = await repository.findOne({
      where: [{ twitch_username: ttv }, { user_id: target.id }],
    });
    if (isStreamer)
      return await interaction.editReply({
        content:
          'Пользователь уже является стримером. Проверьте список стримеров с помощью команды /streamerslist',
      });

    const newStreamer = repository.create({
      twitch_username: ttv,
      user_id: target.id,
    });

    await newStreamer.save();
    return await interaction.editReply({ content: 'Новый стример добавлен в список' });
  },
};

export default command;
