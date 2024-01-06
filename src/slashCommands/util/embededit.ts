import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('embededit')
    .addStringOption((option) => {
      return option.setName('json').setDescription('JSON текст эмбеда').setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('message_id')
        .setDescription('id сообщения для редактирования')
        .setRequired(true);
    })
    .setDescription('Редактировать сообщение бота с новым эмбедом в JSON')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'э а где' });
    const text = interaction.options.getString('json');
    const msgId = interaction.options.getString('message_id');

    const message = await interaction.channel.messages.fetch(msgId).catch(async (e) => {
      const embedError = new EmbedBuilder()
        .setTitle('Произошла ошибка при обработке эмбеда')
        .setDescription(
          'Возможно сообщения с таким id не существует в канале, в котором была исполнена команда. Перепроверьте введённые данные. Редактирование эмбеда доступно только в том канале, где находится исходное сообщение',
        )
        .setFields({ name: e.name, value: e.message })
        .setColor('#ff0000')
        .setTimestamp();
      await interaction.user.send({ embeds: [embedError] });
      return await interaction.editReply({ content: 'Ошибка, проверьте ЛС' });
    });
    try {
      // eslint-disable-next-line no-var
      var jsontext = JSON.parse(text);
    } catch (e) {
      const embedError = new EmbedBuilder()
        .setTitle('Произошла ошибка при обработке эмбеда')
        .setDescription('Проверьте наличие всех скобок, возможно, вы их упустили.')
        .setFields({ name: e.name, value: e.message })
        .setColor('#ff0000')
        .setTimestamp();
      await interaction.user.send({ embeds: [embedError] });
      return await interaction.editReply({ content: 'Ошибка, проверьте ЛС' });
    }
    await message
      .edit({ embeds: [new EmbedBuilder(jsontext)] })
      .then(async () => {
        return await interaction.editReply({ content: 'Эмбед успешно отправлен' });
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (e: any) => {
        const embedError = new EmbedBuilder()
          .setTitle('Произошла ошибка при обработке эмбеда')
          .setDescription('Проверьте наличие всех скобок, возможно, вы их упустили.')
          .setFields({ name: e.name, value: e.message })
          .setColor('#ff0000')
          .setTimestamp();
        await interaction.user.send({ embeds: [embedError] });
        return await interaction.editReply({ content: 'Ошибка, проверьте ЛС' });
      });
  },
};

export default command;
