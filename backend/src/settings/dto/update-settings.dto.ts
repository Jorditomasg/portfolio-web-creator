import { IsString, IsOptional, IsUrl, ValidateIf, IsEmail, IsBoolean, IsIn } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  site_title?: string;

  @ValidateIf(o => o.main_photo_url !== '' && o.main_photo_url != null)
  @IsUrl()
  @IsOptional()
  main_photo_url?: string;

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
}
