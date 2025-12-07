// Define o formato e as regras de validação dos dados de registro.

import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário.',
    example: 'João da Silva',
  })
  @IsString()
  @MinLength(3)
  nome: string;

  @ApiProperty({
    description: 'E-mail único do usuário.',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo de 6 caracteres).',
    example: 'senhaForte123',
  })
  @IsString()
  @MinLength(6)
  senha: string;
}