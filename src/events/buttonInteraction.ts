import { Interaction } from 'discord.js';
import { BotEvent } from '../types';
import { sendCommandLog } from '../utils/sendCommandLog';

const event: BotEvent = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    const button = interaction.client.buttons.get(interaction.customId);
    if (!button) return;
    button.execute(interaction);
    sendCommandLog(interaction);
  },
};

export default event;
