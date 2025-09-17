import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserQueryDto {
  @ApiProperty({ 
    required: false, 
    enum: ['citizen', 'marine_worker', 'analyst', 'moderator', 'admin'],
    description: 'Filter by role'
  })
  @IsOptional()
  @IsEnum(['citizen', 'marine_worker', 'analyst', 'moderator', 'admin'])
  role?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by language',
    example: 'en'
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Search by name or phone',
    example: 'John'
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
