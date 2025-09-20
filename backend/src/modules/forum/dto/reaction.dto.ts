import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({ 
    enum: ['👍', '❤️', '🙏', '😮', '👎'],
    description: 'Emoji reaction',
    example: '👍'
  })
  @IsString()
  @IsEnum(['👍', '❤️', '🙏', '😮', '👎'])
  emoji!: string;
}
