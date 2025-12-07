// "Empacota" o PrismaService para que ele possa ser usado por outros módulos.

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta para outros módulos usarem
})
export class PrismaModule {}