import { IsString, IsNotEmpty, IsOptional, IsHexColor, IsInt, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  long_title?: string;

  @IsString()
  @IsOptional()
  short_title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  long_title_en?: string;

  @IsString()
  @IsOptional()
  short_title_en?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  display_order?: number;
}
