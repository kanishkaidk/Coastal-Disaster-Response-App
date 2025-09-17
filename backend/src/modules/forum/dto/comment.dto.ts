import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ 
    description: 'Comment content',
    example: 'I can help with that! Where exactly are you located?'
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

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
