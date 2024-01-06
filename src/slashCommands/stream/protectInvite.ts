import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import db from '../../connection';
import { InviteEntity } from '../../database/Invites.entity';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('protectinvite')
    .addStringOption((option) => {
      return option
        .setName('code')
        .setNameLocalization('ru', 'код')
        .setDescription('Код инвайта')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('description')
        .setNameLocalization('ru', 'описание')
        .setDescription('Причина сохранения инвайта')
        .setRequired(true);
    })
    .setDescription('Защитить инвайт от удаления')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });

    const repository = await db.getRepository(InviteEntity);
    const code = interaction.options.getString('code');
    const description = interaction.options.getString('description');

    const protectedCode = repository.create({
      code: code,
      protected: true,
      description: description,
    });

    await protectedCode.save();
    return await interaction.editReply({
      content: `Инвайт ${code} защищён от удаления по причине: ${description}`,
    });
  },
};

export default command;
