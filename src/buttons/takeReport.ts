import { ButtonStyle, ChannelType, GuildMember, PermissionsBitField } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { Button } from '../types';
import { getConfig } from '../config/config';

const event: Button = {
  id: 'takeReport',
  execute: async (interaction) => {
    const moder = interaction.member as GuildMember;
    const embed = interaction.message.embeds[0];
    const newEmbed = new EmbedBuilder(embed)
      .addFields({
        name: 'Репорт разбирает',
        value: `${moder}`,
      })
      .setColor(0xfee75c);
    const reportDone = new ButtonBuilder()
      .setCustomId('endReport')
      .setLabel('✅')
      .setStyle(ButtonStyle.Success);
    const reportNumber = embed.title.slice(8);
    const reporter = await interaction.guild.members.fetch(embed.fields[0].value.slice(2, -1));
    const rowOne = new ActionRowBuilder<ButtonBuilder>().addComponents(reportDone);
    await interaction.message.edit({ embeds: [newEmbed], components: [rowOne] });
    const reportChannel = await interaction.guild.channels.create({
      type: ChannelType.GuildVoice,
      name: `Репорт #${reportNumber}`,
      parent: getConfig().channels.categories.reports,
      permissionOverwrites: [
        {
          id: moder.id,
          allow: [
            PermissionsBitField.Flags.MoveMembers,
            PermissionsBitField.Flags.MuteMembers,
            PermissionsBitField.Flags.DeafenMembers,
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
          ],
        },
        {
          id: reporter.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
        },
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    const reporterEmbed = new EmbedBuilder().setDescription(
      `Вашу жалобу #${reportNumber} рассматривает ${moder}\nПерейдите в канал ${reportChannel} для выяснения обстоятельств`,
    );
    await reporter.send({ embeds: [reporterEmbed] });
    return await interaction.reply({ content: 'Вы начали разбирать репорт', ephemeral: true });
  },
};

export default event;
