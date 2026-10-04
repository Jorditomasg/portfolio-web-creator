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
  subtitle?: string;


  @IsString()
  @IsOptional()
  description?: string;


  @ValidateIf(o => o.background_image_url !== '' && o.background_image_url != null)
  @IsUrl()
  @IsOptional()
  background_image_url?: string;
}
