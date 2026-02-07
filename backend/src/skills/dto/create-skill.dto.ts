import { IsString, IsOptional, IsInt, IsUrl, Min, Max } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  category: 'frontend' | 'backend' | 'tools' | 'other';

  @IsInt()
  @Min(1)
  @Max(5)
  level: number;

  @IsUrl()
  @IsOptional()
  icon_url?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  display_order?: number;
}
