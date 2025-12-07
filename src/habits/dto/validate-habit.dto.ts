import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateHabitDto {
  @ApiProperty({ example: 'Vermelho', description: 'A resposta escolhida pelo usuário' })
  @IsString()
  @IsNotEmpty()
  resposta: string;
}