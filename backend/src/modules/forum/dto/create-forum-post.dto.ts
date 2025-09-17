import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsObject, Min, Max } from 'class-validator';

export class CreateForumPostDto {
  @ApiProperty({ 
    enum: ['help', 'info', 'offer'], 
    description: 'Type of forum post',
    example: 'help'
  })
  @IsString()
  @IsEnum(['help', 'info', 'offer'])
  type!: string;

  @ApiProperty({ 
    description: 'Post content',
    example: 'Need help with food and water in Chennai area'
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ 
    required: false, 
    description: 'Media URL (image/video)',
    example: 'https://s3.amazonaws.com/bucket/image.jpg'
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty({ 
    description: 'Location coordinates',
    example: { lat: 13.0827, lng: 80.2707 }
  })
  @IsObject()
  location?: { lat: number; lng: number };

  @ApiProperty({ 
    required: false, 
    description: 'Urgency score (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  urgencyScore?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Language code',
    example: 'en',
    default: 'en'
  })
  @IsOptional()
  @IsString()
  language?: string;
}
