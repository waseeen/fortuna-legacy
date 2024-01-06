import { Entity, Column, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('vmute')
export class VmuteEntity {
  @PrimaryColumn('varchar', { length: 19 })
  user_id: string;

  @Column('datetime')
  date: Date;

  static async getVmute(user_id: string): Promise<undefined | VmuteEntity> {
    return await db.getRepository(VmuteEntity).findOne({ where: { user_id } });
  }

  async save(): Promise<this> {
    return await db.getRepository(VmuteEntity).save(this);
  }
}
