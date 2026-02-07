import { IsString, IsOptional, IsBoolean, IsInt, IsArray, IsUrl, Min, Max } from 'class-validator';

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
  image_url?: string;

  @IsUrl()
  @IsOptional()
  demo_url?: string;

  @IsUrl()
  @IsOptional()
  github_url?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsInt()
  @Min(0)
  @Max(9999)
  @IsOptional()
  display_order?: number;
}
