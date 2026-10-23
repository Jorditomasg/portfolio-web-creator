import { IsArray, IsOptional, IsString } from 'class-validator';

export class SyncGithubDto {
  // full_name ("user/repo") of unpaired repos to create as projects
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  import?: string[];
}
