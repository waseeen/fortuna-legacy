import { Entity, Column, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('invites')
export class InviteEntity {
  @PrimaryColumn('varchar')
  code: string;

  @Column('varchar')
  description: string;

  @Column('boolean', { default: true })
  protected: boolean;

  static async getInvite(code: string): Promise<undefined | InviteEntity> {
    return await db.getRepository(InviteEntity).findOne({ where: { code } });
  }

  async save(): Promise<this> {
    return await db.getRepository(InviteEntity).save(this);
  }
}
