import { Entity, Column, PrimaryColumn } from 'typeorm';
import { client } from '../client';
import { EmbedBuilder } from '@discordjs/builders';
import noun from 'plural-ru';
import db from '../connection';

@Entity('users')
export class UsersEntity {
  @PrimaryColumn('varchar', { length: 19 })
  user_id!: string;

  @Column('double', { default: 0 })
  coins!: number;

  @Column('double', { default: 0 })
  voice_time!: number;

  @Column({ type: 'smallint', default: 0 })
  warns!: number;

  @Column({ default: 0 })
  iwarns!: number;

  static async getUser(user_id: string): Promise<UsersEntity> {
    const repository = db.getRepository(UsersEntity);
    const user = await repository.findOne({ where: { user_id } });

    if (user) return user;

    const newUser = repository.create({
      user_id: user_id,
      warns: 0,
      iwarns: 0,
      voice_time: 0,
      coins: 0,
    });

    return await repository.save(newUser);
  }

  async save(): Promise<this> {
    return await db.getRepository(UsersEntity).save(this);
  }

  async giveCoins(amount: number): Promise<void> {
    amount = Math.floor(amount);

    this.coins += amount;
    await this.save();

    const member = await client.users.fetch(this.user_id);
    if (!member) return;

    const givenRus = noun(amount, 'голда', 'голды', 'голды');
    const balanceRus = noun(this.coins, 'голда', 'голды', 'голды');

    const embedProfit = new EmbedBuilder()
      .setColor(0x0000ff)
      .setTitle('Изменение баланса')
      .addFields(
        { name: 'Начислено', value: amount + ' ' + givenRus, inline: true },
        { name: 'Баланс', value: this.coins.toFixed(1) + ' ' + balanceRus, inline: true },
      );
    await member.send({ embeds: [embedProfit] });
  }
}
