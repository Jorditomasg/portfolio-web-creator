import { IsString, IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class UpdateHeroDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  title_highlight?: string;

  @IsString()
  @IsOptional()
  title_en?: string;

  @IsString()
  @IsOptional()
  title_highlight_en?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  subtitle_en?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @ValidateIf(o => o.background_image_url !== '' && o.background_image_url != null)
  @IsUrl()
  @IsOptional()
  background_image_url?: string;
}
