import { MessageReaction, TextChannel, User } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { BotEvent } from '../types';
import { getConfig } from '../config/config';
import { client } from '../client';

const event: BotEvent = {
  name: 'messageReactionRemove',
  execute: async (reaction: MessageReaction, target: User) => {
    const guild = client.guilds.cache.get(getConfig().guild);
    const member = guild.members.cache.get(target.id);
    const channel = guild.channels.cache.get(getConfig().reactionRoles.logs) as TextChannel;
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        return;
      }
    }
    if (reaction.message.id == getConfig().reactionRoles.message) {
      const checkReaction = reaction.emoji.name in getConfig().reactionRoles.roles;
      if (checkReaction) {
        await member.roles.remove(getConfig().reactionRoles.roles[reaction.emoji.name]);
        const embed = new EmbedBuilder().setDescription(
          `${target} убрал <@&${getConfig().reactionRoles.roles[reaction.emoji.name]}>`,
        );
        channel.send({ embeds: [embed] });
      }
    }
  },
};

export default event;
