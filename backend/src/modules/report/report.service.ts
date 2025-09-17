import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: { type: string; description: string; mediaUrl?: string; location: { lat: number; lng: number } }) {
    const pointWkt = `POINT(${dto.location.lng} ${dto.location.lat})`;
    return this.prisma.$executeRaw`SELECT 1`; // placeholder
  }

  async listNearby(lat: number, lng: number, radiusMeters = 5000) {
    return [];
  }
}


