import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('portfolio_settings')
export class PortfolioSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Portfolio' })
  site_title: string;

  @Column({ length: 500, nullable: true })
  main_photo_url: string;

  @Column({ type: 'text', nullable: true })
  meta_description: string;

  @Column({ length: 500, nullable: true })
  seo_image_url: string;

  @Column({ length: 500, nullable: true })
  hero_background_url: string;

  // Social links (optional)
  @Column({ length: 255, nullable: true })
  linkedin_url: string;

  @Column({ length: 255, nullable: true })
  github_url: string;

  @Column({ length: 255, nullable: true })
  email: string;

  // Appearance settings
  @Column({ default: 'terminal' })
  favicon_type: string; // terminal, code, rocket, star, briefcase, user

  @Column({ default: '#F5A623' })
  accent_color: string; // hex color

  // Navigation settings
  @Column({ default: true })
  show_admin_link: boolean;

  // Umami analytics (self-hosted). Both set = tracker script injected on the public site.
  @Column({ length: 500, nullable: true })
  umami_url: string;

  @Column({ length: 100, nullable: true })
  umami_website_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
