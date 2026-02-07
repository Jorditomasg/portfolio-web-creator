import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column({ length: 100, nullable: true })
  period: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  achievements: string[];

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
