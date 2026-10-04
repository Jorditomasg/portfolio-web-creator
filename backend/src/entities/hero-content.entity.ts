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



  @Column({ nullable: true })
  subtitle: string;


  @Column({ type: 'text', nullable: true })
  description: string;



  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
