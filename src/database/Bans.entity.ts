import { Entity, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('bans')
export class BansEntity {
  @PrimaryColumn('varchar')
  user_id: string;

  static async getBan(user_id: string): Promise<undefined | BansEntity> {
    return await db.getRepository(BansEntity).findOne({ where: { user_id } });
  }

  async save(): Promise<this> {
    return await db.getRepository(BansEntity).save(this);
  }
}
