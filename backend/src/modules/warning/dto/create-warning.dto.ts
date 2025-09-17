import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsObject, Min, Max, IsDateString } from 'class-validator';

export class CreateWarningDto {
  @ApiProperty({ 
    enum: ['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'],
    description: 'Warning type',
    example: 'flood'
  })
  @IsString()
  @IsEnum(['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'])
  type!: string;

  @ApiProperty({ 
    description: 'Warning message',
    example: 'Heavy rainfall expected in Chennai coastal areas. Avoid low-lying areas.'
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({ 
    description: 'Severity level (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  severity!: number;

  @ApiProperty({ 
    description: 'Warning area as GeoJSON polygon',
    example: {
      type: 'Polygon',
      coordinates: [[[80.1, 13.0], [80.2, 13.0], [80.2, 13.1], [80.1, 13.1], [80.1, 13.0]]]
    }
  })
  @IsObject()
  area!: any; // GeoJSON Polygon

  @ApiProperty({ 
    description: 'Warning valid from',
    example: '2024-01-17T10:00:00Z'
  })
  @IsDateString()
  validFrom!: string;

  @ApiProperty({ 
    description: 'Warning valid until',
    example: '2024-01-18T10:00:00Z'
  })
  @IsDateString()
  validTo!: string;

  @ApiProperty({ 
    required: false,
    description: 'Additional instructions or actions',
    example: 'Evacuate immediately. Contact emergency services at 108.'
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({ 
    required: false,
    description: 'Source organization',
    example: 'IMD Chennai'
  })
  @IsOptional()
  @IsString()
  source?: string;
}
