import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  bio_en?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights_en?: string[];
}
