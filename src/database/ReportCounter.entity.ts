import { Column, Entity, PrimaryColumn } from 'typeorm';
import db from '../connection';

@Entity('reportCounter')
export class ReportCounterEntity {
  @PrimaryColumn({ type: 'smallint', default: 1 })
  id!: number;

  @Column({ type: 'smallint', default: 0 })
  counter!: number;

  static async getCounter(): Promise<undefined | ReportCounterEntity> {
    return await db.getRepository(ReportCounterEntity).findOneBy({
      id: 1,
    });
  }

  async save(): Promise<this> {
    return await db.getRepository(ReportCounterEntity).save(this);
  }
}
