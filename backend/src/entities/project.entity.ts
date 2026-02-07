import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
  technologies: string[];

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
