// Define o formato e as regras de validação dos dados de login.

import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'E-mail cadastrado do usuário.',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha cadastrada do usuário.',
    example: 'senhaForte123',
  })
  @IsString()
  @MinLength(6)
  senha: string;
}