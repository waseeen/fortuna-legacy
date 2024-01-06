import { Column, Entity, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('closes')
export class ClosesEntity {
  @PrimaryColumn('varchar')
  user_id: string;

  @Column('varchar')
  category_id: string;

  @Column('varchar')
  announce_id: string;

  @Column('varchar')
  log_id: string;

  @Column('datetime')
  start: Date;

  @Column('varchar')
  name: string;

  static async getClose(user_id: string): Promise<undefined | ClosesEntity> {
    return await db.getRepository(ClosesEntity).findOne({ where: { user_id } });
  }

  async save(): Promise<this> {
    return await db.getRepository(ClosesEntity).save(this);
  }
}
