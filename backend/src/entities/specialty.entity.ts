import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;


  @Column({ type: 'text' })
  description: string;


  @Column({ length: 50, default: 'primary' })
  color: string; // primary, green, blue

  // Icon type: 'frontend', 'backend', 'devops', 'database', 'mobile', 'cloud'
  @Column({ length: 50, default: 'frontend' })
  icon_type: string;

  @Column('simple-array', { nullable: true })
  technologies: string[];

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
