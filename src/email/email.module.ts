// "Empacota" o EmailService para que ele possa ser injetado em outros serviços.

import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config'; // Importa ConfigModule

@Module({
  imports: [ConfigModule], // Precisa do ConfigModule para ler .env
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}