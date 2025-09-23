import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: { type: string; description: string; mediaUrl?: string; location: { lat: number; lng: number } }) {
    // Convert location to GeoJSON string for SQLite
    const locationJson = JSON.stringify({
      type: 'Point',
      coordinates: [dto.location.lng, dto.location.lat]
    });

    // Ensure user exists (for testing purposes)
    let user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: userId,
          phone: '+1234567890',
          name: 'Test User',
          role: 'citizen'
        }
      });
    }

    const report = await this.prisma.report.create({
      data: {
        userId,
        type: dto.type,
        description: dto.description,
        mediaUrl: dto.mediaUrl,
        location: locationJson,
        trustScore: 0,
        status: 'pending'
      },
      include: {
        user: true
      }
    });

    return report;
  }

  async listNearby(lat: number, lng: number, radiusMeters = 5000) {
    // For SQLite, we'll return all reports for now
    // In production, you'd implement proper geospatial queries
    const reports = await this.prisma.report.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return reports;
  }

  async getById(id: string) {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.report.update({
      where: { id },
      data: { status }
    });
  }
}


