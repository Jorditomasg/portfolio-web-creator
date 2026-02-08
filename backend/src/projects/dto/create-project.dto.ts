import { IsString, IsOptional, IsBoolean, IsInt, IsArray, IsUrl, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  title_en?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsString()
  @IsOptional()
  long_description?: string;

  @IsString()
  @IsOptional()
  long_description_en?: string;

  @IsUrl()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  image_url?: string;

  @IsUrl()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  demo_url?: string;

  @IsUrl()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  github_url?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  is_in_progress?: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  start_date?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  end_date?: string;

  @IsInt()
  @Min(0)
  @Max(9999)
  @IsOptional()
  display_order?: number;
}

