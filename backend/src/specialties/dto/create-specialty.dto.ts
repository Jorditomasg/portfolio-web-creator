import { IsString, IsOptional, IsArray, IsInt, Min, IsIn } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  title_en?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsString()
  @IsOptional()
  @IsIn(['primary', 'green', 'blue'])
  color?: string;

  @IsString()
  @IsOptional()
  @IsIn(['frontend', 'backend', 'devops', 'database', 'mobile', 'cloud'])
  icon_type?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  display_order?: number;
}
