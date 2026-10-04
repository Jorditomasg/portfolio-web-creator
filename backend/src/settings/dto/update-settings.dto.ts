import { IsString, IsOptional, IsUrl, ValidateIf, IsEmail, IsBoolean, IsIn, IsUUID } from 'class-validator';

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

  // Umami analytics
  @ValidateIf(o => o.umami_url !== '' && o.umami_url != null)
  @IsUrl({ require_tld: false })
  @IsOptional()
  umami_url?: string;

  @ValidateIf(o => o.umami_website_id !== '' && o.umami_website_id != null)
  @IsUUID()
  @IsOptional()
  umami_website_id?: string;
}
