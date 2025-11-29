// Define as rotas (endpoints) da API e as conecta com o serviço (AuthService).

import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('1. Autenticação')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '1. Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso. E-mail de ativação enviado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos (ex: e-mail já em uso).' })
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @Get('confirmar-email')
  @ApiOperation({ summary: '2. Ativar a conta do usuário (via link de e-mail)' })
  @ApiResponse({ status: 200, description: 'Conta ativada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Token inválido ou expirado.' })
  confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  @ApiOperation({ summary: '3. Realizar login no sistema' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido. Retorna o token JWT.' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos.' })
  @ApiResponse({ status: 403, description: 'Conta inativa (e-mail não verificado).' })
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }
}