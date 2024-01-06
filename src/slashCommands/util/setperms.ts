import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { client } from '../../client';
import { getConfig } from '../../config/config';
import { getPermissions } from '../../config/permissions';
import { sendErrorLog } from '../../utils/sendErrorLog';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('setperms')
    .setDescription('Update slash commands permissions')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const auth = btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET);
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic ' + auth);

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('scope', 'identify connections');

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: urlencoded,
    };

    const res = await fetch('https://discord.com/api/v10/oauth2/token', requestOptions).then(
      (response) => response.json(),
    );
    const commandsList = await client.application.commands.fetch();
    for (const command of commandsList) {
      if (!getPermissions().commands[command[1].name]) {
        sendErrorLog(command[1].name, 'no perms specified');
      } else {
        try {
          await command[1].permissions.set({
            permissions: getPermissions().commands[command[1].name],
            guild: getConfig().guild,
            token: res.access_token,
          });
        } catch (e) {
          sendErrorLog(command[1].name + ', ' + e.name, e.message, e);
        }
      }
    }

    await interaction.editReply({ content: 'all commands permisisons updated successfully' });
  },
};

export default command;
