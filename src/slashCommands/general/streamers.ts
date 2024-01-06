import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { StreamersEntity } from '../../database/Streamers.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('streamers')
    .setDescription('Список всех стримеров сервера'),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const repository = db.getRepository(StreamersEntity);
    const streamers = await repository.find();
    const embed = new EmbedBuilder()
      .setTitle('Список стримеров сервера')
      .setColor(getConfig().colors.twitch)
      .setFooter({
        text: 'Хотите попасть в список стримеров нашего  сервера? Напишите администрации и, надеемся, мы сможем договориться о сотрудничестве',
      });

    for await (const streamer of streamers) {
      embed.addFields({
        name: `http://twitch.tv/${streamer.twitch_username}`,
        value: `<@${streamer.user_id}>`,
      });
    }
    return interaction.editReply({ embeds: [embed] });
  },
};

export default command;
