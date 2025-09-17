import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Phone number',
    example: '+919876543210'
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ 
    required: false,
    description: 'User name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    required: false,
    enum: ['citizen', 'marine_worker', 'analyst', 'moderator', 'admin'],
    description: 'User role',
    example: 'citizen',
    default: 'citizen'
  })
  @IsOptional()
  @IsEnum(['citizen', 'marine_worker', 'analyst', 'moderator', 'admin'])
  role?: string;

  @ApiProperty({ 
    required: false,
    description: 'Preferred language',
    example: 'en',
    default: 'en'
  })
  @IsOptional()
  @IsString()
  language?: string;
}
