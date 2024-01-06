import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Button } from '../types';

module.exports = async (client: Client) => {
  const buttonsDir = join(__dirname, '../buttons');
  readdirSync(buttonsDir).forEach(async (file) => {
    if (!file.endsWith('.js')) return;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const button: Button = require(`${buttonsDir}/${file}`).default;
    if (!button.id) return;
    client.buttons.set(button.id, button);
  });
  console.log(`Buttons loaded:${client.buttons.size}`);
};
