import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('work_philosophy')
export class WorkPhilosophy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  statement: string;

  @Column({ type: 'text', nullable: true })
  approach: string;

  @Column({ type: 'text', array: true, default: [] })
  values: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
