import { Client, Options, Partials, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Collection } from '@discordjs/collection';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Button, SlashCommand } from '../types';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
const { Reaction, Message } = Partials;

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

export const googleDoc = new GoogleSpreadsheet(process.env.GOOGLE_DOCUMENT_ID, serviceAccountAuth);

const allIntents =
  GatewayIntentBits.Guilds +
  GatewayIntentBits.GuildMembers +
  GatewayIntentBits.GuildModeration +
  GatewayIntentBits.GuildEmojisAndStickers +
  GatewayIntentBits.GuildIntegrations +
  GatewayIntentBits.GuildWebhooks +
  GatewayIntentBits.GuildInvites +
  GatewayIntentBits.GuildVoiceStates +
  GatewayIntentBits.GuildPresences +
  GatewayIntentBits.GuildMessages +
  GatewayIntentBits.GuildMessageReactions +
  GatewayIntentBits.GuildMessageTyping +
  GatewayIntentBits.DirectMessages +
  GatewayIntentBits.DirectMessageReactions +
  GatewayIntentBits.DirectMessageTyping +
  GatewayIntentBits.MessageContent +
  GatewayIntentBits.GuildScheduledEvents +
  GatewayIntentBits.AutoModerationConfiguration +
  GatewayIntentBits.AutoModerationExecution;

export const client = new Client({
  makeCache: Options.cacheWithLimits({
    GuildMemberManager: 1000,
  }),

  intents: allIntents,
  partials: [Reaction, Message],
});

export const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.slashCommands = new Collection<string, SlashCommand>();
client.buttons = new Collection<string, Button>();
client.invites = [];

const handlersDir = join(__dirname, '../handlers');
readdirSync(handlersDir).forEach((handler) => {
  if (!handler.endsWith('.js')) return;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(`${handlersDir}/${handler}`)(client);
});

export const startBot = async (): Promise<void> => {
  await client.login(process.env.TOKEN);
};
