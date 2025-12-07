// O módulo principal (raiz) que carrega todos os outros módulos da aplicação.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { CertificatesModule } from './certificates/certificates.module'; // Importe

@Module({
  imports: [
    // Configura o .env para ser global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    HabitsModule,
    PrismaModule,
    EmailModule,
    CertificatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}