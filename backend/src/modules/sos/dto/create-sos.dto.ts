import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateSosDto {
  @ApiProperty({ 
    required: false,
    description: 'SOS message',
    example: 'Help! I am trapped in flood waters near Marina Beach'
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ 
    description: 'Location coordinates',
    example: { lat: 13.0827, lng: 80.2707 }
  })
  @IsObject()
  location!: { lat: number; lng: number };

  @ApiProperty({ 
    required: false,
    description: 'Media URL (photo/video)',
    example: 'https://s3.amazonaws.com/bucket/sos-photo.jpg'
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
