import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { getConfig } from '../../config/config';
import { UsersEntity } from '../../database/Users.entity';
import { BansEntity } from '../../database/Bans.entity';
import db from '../../connection';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('warn')
    .addUserOption((option) => {
      return option
        .setName('user')
        .setNameLocalization('ru', 'пользователь')
        .setDescription('Участник сервера')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('reason')
        .setNameLocalization('ru', 'причина')
        .setDescription('Причина варна')
        .setRequired(true);
    })
    .setDescription('Выдать варн')
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.options) return await interaction.editReply({ content: 'Э а где аргументы?' });
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    if (target instanceof GuildMember) {
      const banRepository = db.getRepository(BansEntity);
      const user = await UsersEntity.getUser(target.id);
      const channel = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.warns,
      ) as TextChannel;
      const channelBan = interaction.guild.channels.cache.get(
        getConfig().channels.text.log.bans,
      ) as TextChannel;
      // отчет о варне
      const embedLog = new EmbedBuilder()
        .setTitle('Варн')
        .setDescription(`${interaction.user} выдал варн ${target} по причине ${reason}.`)
        .setColor(getConfig().colors.warn_log);
      await channel.send({ embeds: [embedLog] });
      // сообщение об успешном варне
      await interaction.editReply({
        content: `Вы выдали варн ${target} по причине: "**${reason}**"`,
      });
      // сообщение о варне таргету
      const embedWarn = new EmbedBuilder();
      embedWarn
        .setTitle('Лови варн!')
        .setFields({
          name: 'Варн выдал: ',
          value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\nЕсли хочешь обжаловать наказание,  заполни апелляцию в канале <#1141715785358778499>.`,
        })
        .setColor(getConfig().colors.warn);
      switch (user.warns) {
        case 0: {
          embedWarn.setDescription(
            `Пока что это твое первое предупреждение. Оно выдано за нарушение правила ${reason}. Будь осторожнее, если получишь еще 2 варна - получишь бан!`,
          );
          await target.send({ embeds: [embedWarn] });
          break;
        }
        case 1: {
          embedWarn.setDescription(
            `А ты уже опытный нарушитель... Предупреждение выдано за нарушение правила ${reason}. По-дружески напоминаю, что тебе осталось всего одно нарушение до заветного БАНА!!! Или ты этого не хочешь??(`,
          );
          await target.send({ embeds: [embedWarn] });
          break;
        }
        case 2: {
          embedWarn.setDescription(
            `Ну, вот и все, неплохая получилась история... Предупреждение выдано за нарушение правила ${reason}. К сожалению, за этим сообщением последует бан. :pleading_face: `,
          );
          const embedBanTarget = new EmbedBuilder()
            .setTitle('Пока-пока!')
            .setDescription(
              'Ты получил бан на нашем сервере потому что получил максимальное количество варнов.  Его можно снять, купив разбан в канале <#1141720181551403061>, или дождавшись амнистии.',
            )
            .setFields({
              name: 'Бан выдал: ',
              value: `<@${interaction.user.id}> (id: ${interaction.user.id}).\nЕсли хочешь подать апелляцию на разбан,  заполни апелляцию в канале <#1141715954921898046>.`,
            })
            .setColor(getConfig().colors.ban);
          await target.send({ embeds: [embedWarn, embedBanTarget] });
          await target.roles.set([getConfig().roles.ban]);
          await target.roles.add([getConfig().roles.ban]);
          const banEntity = banRepository.create({
            user_id: target.id,
          });
          await banEntity.save();
          const embedBan = new EmbedBuilder()
            .setTitle('Бан')
            .setDescription(`Бот выдал бан ${target} по причине 3/3 варнов.`)
            .setColor(getConfig().colors.ban_log);
          await channelBan.send({ embeds: [embedBan] });
        }
      }
      user.warns = user.warns + 1;
      await user.save();
    } else {
      return await interaction.editReply({
        content: `${target.nick} это не участник, ты че то перепутал`,
      });
    }
  },
};

export default command;
