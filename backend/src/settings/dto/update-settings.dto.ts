import { IsString, IsOptional, IsUrl, ValidateIf, IsEmail, IsBoolean, IsIn } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  site_title?: string;

  @IsString()
  @IsOptional()
  main_photo_url?: string;

  @IsString()
  @IsOptional()
  hero_background_url?: string;

  @IsString()
  @IsOptional()
  seo_image_url?: string;

  @IsString()
  @IsOptional()
  meta_description?: string;

  // Social links (all optional, validated only if provided)
  @ValidateIf(o => o.linkedin_url !== '' && o.linkedin_url != null)
  @IsUrl()
  @IsOptional()
  linkedin_url?: string;

  @ValidateIf(o => o.github_url !== '' && o.github_url != null)
  @IsUrl()
  @IsOptional()
  github_url?: string;

  @ValidateIf(o => o.email !== '' && o.email != null)
  @IsEmail()
  @IsOptional()
  email?: string;

  // Appearance settings
  @IsString()
  @IsOptional()
  @IsIn(['terminal', 'code', 'rocket', 'star', 'briefcase', 'user'])
  favicon_type?: string;

  @IsString()
  @IsOptional()
  accent_color?: string;

  // Navigation settings
  @IsBoolean()
  @IsOptional()
  show_admin_link?: boolean;

  // Contact System Configuration
  @IsBoolean()
  @IsOptional()
  enable_contact_form?: boolean;

  @IsBoolean()
  @IsOptional()
  enable_email_sending?: boolean;

  @IsBoolean()
  @IsOptional()
  enable_database_storage?: boolean;

  // SMTP Settings
  @IsString()
  @IsOptional()
  smtp_host?: string;

  @IsOptional() // TypeORM might return string or number
  smtp_port?: number;

  @IsString()
  @IsOptional()
  smtp_user?: string;

  @IsString()
  @IsOptional()
  smtp_pass?: string;

  @IsBoolean()
  @IsOptional()
  smtp_secure?: boolean;

  @IsBoolean()
  @IsOptional()
  smtp_require_tls?: boolean;

  @IsString()
  @IsOptional()
  smtp_from?: string;
}
