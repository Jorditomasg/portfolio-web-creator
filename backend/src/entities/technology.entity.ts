import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('technologies')
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  icon: string; // URL or SVG content

  @Column({ nullable: true })
  category: string; // Legacy, kept for backward compatibility

  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => Category, cat => cat.technologies, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category_entity: Category;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ default: false })
  show_in_about: boolean;

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

