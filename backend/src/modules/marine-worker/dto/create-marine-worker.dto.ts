import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMarineWorkerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
}
