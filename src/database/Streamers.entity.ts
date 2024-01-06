import { Entity, Column, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('streamers')
export class StreamersEntity {
  @PrimaryColumn('varchar')
  twitch_username: string;

  @PrimaryColumn('varchar')
  user_id: string;

  @Column('smallint', { default: 0 })
  live: number;

  static async getStreamer(twitch_username: string): Promise<undefined | StreamersEntity> {
    return await db.getRepository(StreamersEntity).findOne({ where: { twitch_username } });
  }

  async save(): Promise<this> {
    return await db.getRepository(StreamersEntity).save(this);
  }
}
