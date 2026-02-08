import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Technology } from './technology.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  title_en: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({ type: 'text', nullable: true })
  long_description: string;

  @Column({ type: 'text', nullable: true })
  long_description_en: string;

  @Column({ length: 500, nullable: true })
  image_url: string;

  @Column({ length: 500, nullable: true })
  demo_url: string;

  @Column({ length: 500, nullable: true })
  github_url: string;

  @Column({ type: 'text', array: true, default: [] })
  technologies: string[]; // Keep for legacy/simple display, but usage should migrate to relation

  @ManyToMany(() => Technology)
  @JoinTable()
  technology_entities: Technology[];

  @Column({ default: false })
  featured: boolean;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ default: false })
  is_in_progress: boolean;

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
