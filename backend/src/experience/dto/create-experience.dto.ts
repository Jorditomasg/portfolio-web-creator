import { IsString, IsOptional, IsArray, IsInt, Min } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  period?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements?: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  display_order?: number;
}
