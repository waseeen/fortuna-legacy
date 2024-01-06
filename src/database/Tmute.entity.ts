import { Entity, Column, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('tmute')
export class TmuteEntity {
  @PrimaryColumn('varchar', { length: 19 })
  user_id: string;

  @Column('datetime')
  date: Date;

  static async getTmute(user_id: string): Promise<undefined | TmuteEntity> {
    return await db.getRepository(TmuteEntity).findOne({ where: { user_id } });
  }

  async save(): Promise<this> {
    return await db.getRepository(TmuteEntity).save(this);
  }
}
