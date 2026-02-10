import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('about_content')
export class AboutContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  bio_en: string;


  @Column({ type: 'text', array: true, default: [] })
  highlights: string[];

  @Column({ type: 'text', array: true, default: [] })
  highlights_en: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
