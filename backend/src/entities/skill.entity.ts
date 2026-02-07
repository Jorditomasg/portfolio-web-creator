import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 50 })
  category: 'frontend' | 'backend' | 'tools' | 'other';

  @Column({ type: 'int' })
  level: number;

  @Column({ length: 500, nullable: true })
  icon_url: string;

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
