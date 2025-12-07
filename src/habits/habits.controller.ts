import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { ValidateHabitDto } from './dto/validate-habit.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard'; 

@ApiTags('2. Hábitos e Gamificação')
@ApiBearerAuth() 
@UseGuards(AuthGuard) 
@Controller('api/habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Listar todos os hábitos disponíveis no catálogo' })
  findAll() {
    return this.habitsService.findAll();
  }

  @Post('follow/:id')
  @ApiOperation({ summary: 'Adicionar um hábito à minha lista (Seguir)' })
  follow(@Param('id') id: string, @Request() req) {
    return this.habitsService.followHabit(req.user.userId, id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Listar meus hábitos e verificar se fiz hoje' })
  getMyHabits(@Request() req) {
    return this.habitsService.getMyHabits(req.user.userId);
  }

  @Post('validate/:id')
  @ApiOperation({ summary: 'Validar hábito (Responder Quiz) e ganhar pontos' })
  validate(
    @Param('id') id: string,
    @Body() dto: ValidateHabitDto,
    @Request() req,
  ) {
    return this.habitsService.validateHabit(req.user.userId, id, dto.resposta);
  }
}