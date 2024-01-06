import { Column, Entity, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('events')
export class EventsEntity {
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

  static async getEvent(user_id: string): Promise<undefined | EventsEntity> {
    return await db.getRepository(EventsEntity).findOne({ where: { user_id } });
  }

  async save(): Promise<this> {
    return await db.getRepository(EventsEntity).save(this);
  }
}
