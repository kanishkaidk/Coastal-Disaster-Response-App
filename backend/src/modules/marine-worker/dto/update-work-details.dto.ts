import { IsString, IsOptional } from 'class-validator';

export class UpdateWorkDetailsDto {
  @IsString()
  @IsOptional()
  workToday?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}
