import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];
}
