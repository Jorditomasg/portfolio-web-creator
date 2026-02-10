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

  // Contact System Configuration
  @Column({ default: true })
  enable_contact_form: boolean;

  @Column({ default: false })
  enable_email_sending: boolean;

  @Column({ default: true })
  enable_database_storage: boolean;

  // SMTP Settings (Optional, for email sending)
  @Column({ nullable: true })
  smtp_host: string;

  @Column({ nullable: true })
  smtp_port: number;

  @Column({ nullable: true })
  smtp_user: string;

  @Column({ nullable: true })
  smtp_pass: string;

  @Column({ default: false })
  smtp_secure: boolean;

  @Column({ default: true })
  smtp_require_tls: boolean;

  @Column({ nullable: true })
  smtp_from: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
