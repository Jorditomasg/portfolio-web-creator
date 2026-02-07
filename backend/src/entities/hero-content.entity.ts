import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hero_content')
export class HeroContent {
  @PrimaryGeneratedColumn()
  id: number;

  // Main title (white text)
  @Column({ nullable: true })
  title: string;

  // Highlighted part of title (yellow text) - e.g. "especialista en Angular"
  @Column({ nullable: true })
  title_highlight: string;

  // English versions
  @Column({ nullable: true })
  title_en: string;

  @Column({ nullable: true })
  title_highlight_en: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ nullable: true })
  subtitle_en: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({ length: 500, nullable: true })
  background_image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
