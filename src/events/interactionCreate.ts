import { Interaction } from 'discord.js';
import { BotEvent } from '../types';
import { sendCommandLog } from '../utils/sendCommandLog';

const event: BotEvent = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.slashCommands.get(interaction.commandName);
    if (!command) return;
    command.execute(interaction);
    sendCommandLog(interaction);
  },
};

export default event;
