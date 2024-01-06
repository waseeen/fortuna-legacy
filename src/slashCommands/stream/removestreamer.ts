import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { StreamersEntity } from '../../database/Streamers.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('removestreamer')
    .addStringOption((option) => {
      return option
        .setName('twitch_nickname')
        .setNameLocalization('ru', 'никнейм')
        .setDescription('Никнейм стримера на твиче')
        .setRequired(true);
    })
    .setDescription('Убрать пользователя из списка стримеров')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return interaction.editReply({ content: 'Э а где аргументы?' });

    const repository = await db.getRepository(StreamersEntity);
    const ttv = interaction.options.getString('twitch_nickname');
    const isStreamer = await repository.findOne({
      where: [{ twitch_username: ttv }],
    });
    if (!isStreamer) return interaction.editReply({ content: 'Такого стримера нет в списке' });
    await repository.remove(isStreamer);
    return await interaction.editReply({ content: 'Стример был удалён из списка' });
  },
};

export default command;
