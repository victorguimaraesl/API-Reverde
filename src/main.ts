// Ponto de entrada: cria e "liga" o servidor NestJS, ativando configs globais.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa a validação global (para os DTOs)
  app.useGlobalPipes(new ValidationPipe());

  // --- Configuração do Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API ReVerde')
    .setDescription('Documentação da API para o aplicativo de hábitos ReVerde.')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona o ícone de "cadeado" para autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Define a rota /api-docs
  // --- Fim da Configuração do Swagger ---

  await app.listen(process.env.PORT || 3000);
}
bootstrap();