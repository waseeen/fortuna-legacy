import { Entity, Column, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('settings')
export class SettingsEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  value: string;

  static async getStreamer(id: string): Promise<undefined | SettingsEntity> {
    return await db.getRepository(SettingsEntity).findOne({ where: { id } });
  }

  async save(): Promise<this> {
    return await db.getRepository(SettingsEntity).save(this);
  }
}
