import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard'; 

@ApiTags('3. Loja de Certificados')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('all')
  @ApiOperation({ summary: 'Listar todos os certificados disponíveis para compra' })
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'Listar os certificados que eu já conquistei' })
  getMyCertificates(@Request() req) {
    return this.certificatesService.getMyCertificates(req.user.userId);
  }

  @Post('buy/:id')
  @ApiOperation({ summary: 'Trocar ecopontos por um certificado' })
  buy(@Param('id') id: string, @Request() req) {
    return this.certificatesService.buyCertificate(req.user.userId, id);
  }
}