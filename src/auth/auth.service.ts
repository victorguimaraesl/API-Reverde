// Contém a lógica de negócio principal: registrar, logar, e confirmar e-mail.

import { Injectable, ConflictException, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  // Injeção de Dependência: O NestJS "injeta" os serviços
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Endpoint 1: Criação de Conta (Registro)
   */
  async register(registerDto: RegisterUserDto) {
    const { nome, email, senha } = registerDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await this.prisma.user.create({
      data: {
        nome,
        email,
        senhaHash,
        ativo: false,
        ecopontos: 0,
        activationToken: {
          create: {
            token: uuidv4(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
          },
        },
      },
      include: {
        activationToken: true,
      },
    });

    const activationLink = `${this.configService.get<string>(
      'API_BASE_URL',
    )}/api/auth/confirmar-email?token=${user.activationToken.token}`;
    
    await this.emailService.sendActivationEmail(user.email, user.nome, activationLink);

    return { message: 'Usuário criado. Verifique seu e-mail para ativar a conta.' };
  }

  /**
   * Endpoint 2: Ativação da Conta (Link do E-mail)
   */
  async confirmEmail(token: string) {
    const activationToken = await this.prisma.activationToken.findUnique({
      where: { token },
    });

    if (!activationToken || new Date() > activationToken.expiresAt) {
      throw new NotFoundException('Token inválido ou expirado.');
    }

    await this.prisma.user.update({
      where: { id: activationToken.userId },
      data: { ativo: true },
    });

    await this.prisma.activationToken.delete({
      where: { id: activationToken.id },
    });

    return '<h1>Conta ativada com sucesso!</h1><p>Você já pode fechar esta aba e fazer login no aplicativo.</p>';
  }

  /**
   * Endpoint 3: Login (Autenticação)
   */
  async login(loginDto: LoginUserDto) {
    const { email, senha } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    if (!user.ativo) {
      throw new ForbiddenException('Conta inativa. Por favor, verifique seu e-mail.');
    }

    const isSenhaValid = await bcrypt.compare(senha, user.senhaHash);
    if (!isSenhaValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // Gera o Token de Login (JWT)
    const payload = { userId: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ecopontos: user.ecopontos,
      },
    };
  }
}