// Contém a lógica de negócio para configurar e enviar e-mails (Nodemailer).

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  // Usa ConfigService para ler o .env de forma segura
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendActivationEmail(userEmail: string, userName: string, activationLink: string) {
    const mailOptions = {
      from: '"ReVerde App" <victorguimaraes980@gmail.com>',
      to: userEmail,
      subject: 'Ative sua conta ReVerde!',
      html: `
        <h2>Olá, ${userName}!</h2>
        <p>Obrigado por se cadastrar. Clique no link para ativar sua conta:</p>
        <a href="${activationLink}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          Ativar minha conta
        </a>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
