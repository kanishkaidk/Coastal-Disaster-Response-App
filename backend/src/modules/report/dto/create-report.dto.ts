import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ enum: ['flood', 'cyclone', 'accident', 'pollution'] })
  @IsString()
  @IsIn(['flood', 'cyclone', 'accident', 'pollution'])
  type!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty({ description: 'WGS84 coordinates', example: { lat: 13.0827, lng: 80.2707 } })
  @IsNotEmpty()
  location!: { lat: number; lng: number };
}


