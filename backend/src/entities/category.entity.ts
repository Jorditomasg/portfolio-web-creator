import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Technology } from './technology.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Internal identifier (slug-like)

  @Column({ nullable: true })
  long_title: string; // Shown on Home

  @Column({ nullable: true })
  short_title: string; // Shown on About Me

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  long_title_en: string;

  @Column({ nullable: true })
  short_title_en: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({ nullable: true })
  icon: string; // SVG content or icon identifier

  @Column({ default: '#F5A623' })
  color: string;

  @OneToMany(() => Technology, (technology) => technology.category)
  technologies: Technology[];

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
