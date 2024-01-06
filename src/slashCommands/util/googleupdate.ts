import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { docUpdate } from '../../utils/docUpdate';
import { sendErrorLog } from '../../utils/sendErrorLog';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('googleupdate')
    .setDescription('update google drive document with current guild invites')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    docUpdate()
      .then(async () => {
        await interaction.editReply({ content: 'google sheet updated succesfully' });
      })
      .catch(async (e) => {
        await interaction.editReply({ content: 'что-то пошло не так' });
        await sendErrorLog(e.name, e.message);
      });
  },
};

export default command;
