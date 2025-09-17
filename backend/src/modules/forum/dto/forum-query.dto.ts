import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class ForumQueryDto {
  @ApiProperty({ 
    required: false, 
    description: 'Latitude for geo radius search',
    example: 13.0827
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lat?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Longitude for geo radius search',
    example: 80.2707
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lng?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Radius in meters',
    example: 5000,
    default: 10000
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(100)
  @Max(100000)
  radius?: number = 10000;

  @ApiProperty({ 
    required: false, 
    enum: ['help', 'info', 'offer'],
    description: 'Filter by post type'
  })
  @IsOptional()
  @IsEnum(['help', 'info', 'offer'])
  type?: string;

  @ApiProperty({ 
    required: false, 
    enum: ['active', 'under_review', 'removed'],
    description: 'Filter by status'
  })
  @IsOptional()
  @IsEnum(['active', 'under_review', 'removed'])
  status?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Minimum urgency score',
    example: 50,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  minUrgency?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Minimum trust score',
    example: 70,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  minTrust?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Language filter',
    example: 'en'
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Search query',
    example: 'flood help'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Author user ID',
    example: 'user123'
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ 
    required: false, 
    enum: ['createdAt', 'trustScore', 'urgencyScore', 'proximity'],
    description: 'Sort field',
    default: 'createdAt'
  })
  @IsOptional()
  @IsEnum(['createdAt', 'trustScore', 'urgencyScore', 'proximity'])
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    required: false, 
    enum: ['asc', 'desc'],
    description: 'Sort order',
    default: 'desc'
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

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

  @ApiProperty({ 
    required: false, 
    description: 'Cursor for pagination',
    example: 'eyJjcmVhdGVkQXQiOiIyMDI0LTAxLTE3VDEwOjAwOjAwLjAwMFoifQ=='
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}
