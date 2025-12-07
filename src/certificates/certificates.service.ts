import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  // 1. Listar loja (Catálogo)
  async findAll() {
    return this.prisma.certificate.findMany();
  }

  // 2. Listar meus certificados (Carteira)
  async getMyCertificates(userId: string) {
    return this.prisma.userCertificate.findMany({
      where: { userId },
      include: { certificate: true }, // Traz os dados (imagem/título) do certificado
      orderBy: { purchasedAt: 'desc' }
    });
  }

  // 3. Comprar Certificado (Trocar Pontos)
  async buyCertificate(userId: string, certificateId: string) {
    // A. Busca o certificado e o usuário
    const cert = await this.prisma.certificate.findUnique({ where: { id: certificateId } });
    if (!cert) throw new NotFoundException('Certificado não encontrado.');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    // B. Verifica se já tem (Opcional: se quiser permitir comprar repetido, remova isto)
    const jaTem = await this.prisma.userCertificate.findFirst({
      where: { userId, certificateId }
    });
    if (jaTem) {
      throw new BadRequestException('Você já possui este certificado!');
    }

    // C. Verifica saldo
    if (user.ecopontos < cert.custo) {
      throw new BadRequestException(`Saldo insuficiente. Você precisa de ${cert.custo} pontos.`);
    }

    // D. Transação: Desconta pontos + Entrega certificado
    await this.prisma.$transaction([
      // 1. Cria o registro de posse
      this.prisma.userCertificate.create({
        data: { userId, certificateId }
      }),
      // 2. Desconta os pontos da conta
      this.prisma.user.update({
        where: { id: userId },
        data: { ecopontos: { decrement: cert.custo } }
      })
    ]);

    return {
      sucesso: true,
      mensagem: `Parabéns! Você resgatou o certificado "${cert.titulo}".`,
      novoSaldo: user.ecopontos - cert.custo
    };
  }
}