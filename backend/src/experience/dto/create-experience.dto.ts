import { IsString, IsOptional, IsBoolean, IsArray, IsUrl, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExperienceDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  title_en?: string;

  @IsString()
  company: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  company_logo?: string;

  @IsString()
  @IsOptional()
  period?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsBoolean()
  @IsOptional()
  is_current?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements_en?: string[];

  @IsInt()
  @Min(0)
  @Max(9999)
  @IsOptional()
  display_order?: number;
}
