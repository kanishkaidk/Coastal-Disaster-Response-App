import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class WarningQueryDto {
  @ApiProperty({ 
    required: false, 
    enum: ['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'],
    description: 'Filter by warning type'
  })
  @IsOptional()
  @IsEnum(['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'])
  type?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Minimum severity level',
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  minSeverity?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Latitude for geo search',
    example: 13.0827
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lat?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Longitude for geo search',
    example: 80.2707
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lng?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Search radius in meters',
    example: 10000,
    default: 50000
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1000)
  @Max(200000)
  radius?: number = 50000;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by status',
    enum: ['active', 'expired', 'cancelled']
  })
  @IsOptional()
  @IsEnum(['active', 'expired', 'cancelled'])
  status?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Search in message content',
    example: 'flood'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Page limit',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ 
    required: false, 
    description: 'Page offset',
    example: 0,
    default: 0,
    minimum: 0
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
