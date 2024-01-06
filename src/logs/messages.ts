import { client } from '../client';
import { getConfig } from '../config/config';
import { ChannelType, GuildChannel, Message, TextChannel, PartialMessage } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { sendErrorLog } from '../utils/sendErrorLog';

const messageDeleteHandler = async (message: Message | PartialMessage) => {
  if (
    message.channel.type === ChannelType.DM ||
    message.author?.id === client.user?.id ||
    message.guild!.id !== getConfig().guild
  ) {
    return;
  }
  const logsChannel = client.channels.cache.get(
    getConfig().channels.text.log.messages,
  ) as TextChannel;
  if (!logsChannel) return;
  if (!message.author) {
    logsChannel.send(
      `Кто-то удалил сообщение в канале <#${message.channelId}>. Не удалось распознать это сообщение :(`,
    );
    return;
  }

  const { author, attachments, content, id, channel } = message;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author!.tag} ID: ${author!.id}`,
      iconURL: author!.displayAvatarURL(),
    })
    .setDescription(`**\`\`${content ? content.slice(0, 900) : 'Без текста'}\`\`**`)
    .setFooter({ text: `ID: ${id} • #${(channel as GuildChannel).name}` })
    .setTimestamp()
    .setColor(0xed4245);

  logsChannel
    .send({
      embeds: [embed],
      files: Object.values(attachments),
    })
    .catch(() => {});
};

const messageUpdateHandler = async (
  oldMsg: Message | PartialMessage,
  newMsg: Message | PartialMessage,
) => {
  try {
    if (oldMsg.partial) {
      await oldMsg.fetch();
    }
    if (newMsg.partial) {
      await oldMsg.fetch();
    }
    if (!oldMsg.guild || oldMsg.guildId !== getConfig().guild) return;

    if (oldMsg.content?.length === 0 || newMsg.content?.length === 0) return;

    const newContent = newMsg.content;

    const logChannel = client.channels.cache.get(
      getConfig().channels.text.log.messages,
    ) as TextChannel;
    if (!logChannel) return;
    if (!oldMsg.author) {
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `${newMsg.author.tag} ID: ${newMsg.author.id}`,
              iconURL: newMsg.author.displayAvatarURL(),
            })
            .setDescription(
              `${newMsg.author} изменил сообщение **__[Ссылка на сообщение](${oldMsg.url})__** в канале ${newMsg.channel}. Не удалось распознать старое сообщение :(`,
            )
            .setFooter({ text: `ID: ${newMsg.id} • ${(newMsg.channel as GuildChannel).name}` })
            .setTimestamp()
            .setColor(0x3498db),
        ],
      });
      return;
    }
    if (oldMsg.author!.id === client.user!.id) return;
    const { author, channel, id, content: oldContent } = oldMsg;
    if (newContent === oldContent) return;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${author!.tag} ID: ${author!.id}`,
        iconURL: author!.displayAvatarURL(),
      })
      .setDescription(
        `**__[Ссылка на сообщение](${oldMsg.url})__\n` +
          `Старое:\n\`\`${oldContent!.slice(0, 900)}\`\`\n` +
          `\nНовое:\n\`\`${newContent!.slice(0, 900)}\`\`**`,
      )
      .setFooter({ text: `ID: ${id} • #${(channel as GuildChannel).name}` })
      .setTimestamp()
      .setColor(0x3498db);

    logChannel.send({ embeds: [embed] }).catch(() => {});
  } catch (e) {
    sendErrorLog(e.name, e.message, e);
  }
};

client.on('messageDelete', messageDeleteHandler);

client.on('messageUpdate', messageUpdateHandler);
