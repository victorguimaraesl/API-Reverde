import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  // 1. Listar todos os hábitos disponíveis no sistema
  async findAll() {
    return this.prisma.habit.findMany();
  }

  // 2. Adicionar um hábito à lista do usuário ("Seguir hábito")
  async followHabit(userId: string, habitId: string) {
    const exists = await this.prisma.userHabit.findUnique({
      where: {
        userId_habitId: { userId, habitId },
      },
    });

    if (exists) {
      throw new BadRequestException('Você já segue este hábito.');
    }

    return this.prisma.userHabit.create({
      data: { userId, habitId },
    });
  }

  // 3. Listar "Meus Hábitos" (com status de "feito hoje" ou não)
  async getMyHabits(userId: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const userHabits = await this.prisma.userHabit.findMany({
      where: { userId },
      include: { habit: true },
    });

    const result = await Promise.all(
      userHabits.map(async (uh) => {
        const logHoje = await this.prisma.habitLog.findFirst({
          where: {
            userId,
            habitId: uh.habitId,
            dataHora: { gte: hoje },  
          },
        });

        return {
          ...uh.habit,           
          createdAt: uh.createdAt,
          realizadoHoje: !!logHoje,
        };
      }),
    );

    return result;
  }

  // 4. Validar Hábito (Quiz) e Ganhar Pontos
  async validateHabit(userId: string, habitId: string, respostaUsuario: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id: habitId } });
    if (!habit) throw new NotFoundException('Hábito não encontrado.');

    // A. Verifica se já fez hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const jaFez = await this.prisma.habitLog.findFirst({
      where: {
        userId,
        habitId,
        dataHora: { gte: hoje },
      },
    });

    if (jaFez) {
      throw new BadRequestException('Você já validou este hábito hoje! Volte amanhã.');
    }

    // B. Verifica a resposta
    if (respostaUsuario.trim().toLowerCase() !== habit.respostaCorreta.toLowerCase()) {
      throw new BadRequestException(`Resposta incorreta! Tente novamente.`);
    }

    // C. Transação: Salva o Log + Dá os pontos ao usuário
    await this.prisma.$transaction([
      // 1. Cria o registro
      this.prisma.habitLog.create({
        data: {
          userId,
          habitId,
          pontosGanhos: habit.pontos,
        },
      }),
      // 2. Atualiza os pontos do usuário
      this.prisma.user.update({
        where: { id: userId },
        data: { ecopontos: { increment: habit.pontos } },
      }),
    ]);

    return {
      sucesso: true,
      mensagem: `Parabéns! Você ganhou ${habit.pontos} ecopontos.`,
      pontosGanhos: habit.pontos,
    };
  }
}