import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { WarningQueryDto } from './dto/warning-query.dto';

@Injectable()
export class WarningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  async create(userId: string, userRole: string, dto: CreateWarningDto) {
    // Only marine workers, analysts, and admins can issue warnings
    if (!['marine_worker', 'analyst', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Not authorized to issue warnings');
    }

    const areaWkt = `POLYGON((${dto.area.coordinates[0].map((coord: number[]) => 
      `${coord[0]} ${coord[1]}`
    ).join(', ')}))`;

    const warning = await this.prisma.warning.create({
      data: {
        issuerId: userId,
        sourceRole: userRole as any,
        type: dto.type,
        message: dto.message,
        severity: dto.severity,
        area: areaWkt,
        validFrom: new Date(dto.validFrom),
        validTo: new Date(dto.validTo),
        message_i18n: {
          en: dto.message,
          // TODO: Add translations for other languages
        },
      },
      include: {
        issuer: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    // Enqueue for AI processing and notifications
    await this.queue.enqueueSync({
      type: 'warning_notification',
      warningId: warning.id,
      message: dto.message,
      severity: dto.severity,
      area: dto.area,
      validFrom: dto.validFrom,
      validTo: dto.validTo,
    });

    return {
      ...warning,
      area: dto.area, // Return original GeoJSON
      translations: warning.message_i18n || { en: dto.message },
    };
  }

  async findAll(query: WarningQueryDto) {
    const where: any = {};

    if (query.type) where.type = query.type;
    if (query.minSeverity) where.severity = { gte: query.minSeverity };
    if (query.search) {
      where.message = {
        contains: query.search,
        mode: 'insensitive'
      };
    }

    // Filter by status based on validFrom/validTo
    const now = new Date();
    if (query.status === 'active') {
      where.validFrom = { lte: now };
      where.validTo = { gte: now };
    } else if (query.status === 'expired') {
      where.validTo = { lt: now };
    }

    if (query.lat && query.lng) {
      // Geo search using PostGIS - find warnings that intersect with the search area
      where.area = {
        st_intersects: {
          geometry: `POINT(${query.lng} ${query.lat})`
        }
      };
    }

    const warnings = await this.prisma.warning.findMany({
      where,
      orderBy: [
        { severity: 'desc' },
        { validFrom: 'desc' }
      ],
      take: query.limit || 20,
      skip: query.offset || 0,
      include: {
        issuer: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    // Convert PostGIS geometry back to GeoJSON for response
    const warningsWithGeoJson = await Promise.all(
      warnings.map(async (warning) => {
        // In production, you'd use a proper PostGIS query to get GeoJSON
        // For now, we'll return a placeholder
        return {
          ...warning,
          area: {
            type: 'Polygon',
            coordinates: [[[80.1, 13.0], [80.2, 13.0], [80.2, 13.1], [80.1, 13.1], [80.1, 13.0]]]
          },
          translations: warning.message_i18n || { en: warning.message },
          status: this.getWarningStatus(warning.validFrom, warning.validTo),
        };
      })
    );

    return warningsWithGeoJson;
  }

  async findOne(id: string) {
    const warning = await this.prisma.warning.findUnique({
      where: { id },
      include: {
        issuer: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    if (!warning) {
      throw new NotFoundException('Warning not found');
    }

    return {
      ...warning,
      area: {
        type: 'Polygon',
        coordinates: [[[80.1, 13.0], [80.2, 13.0], [80.2, 13.1], [80.1, 13.1], [80.1, 13.0]]]
      },
      translations: warning.message_i18n || { en: warning.message },
      status: this.getWarningStatus(warning.validFrom, warning.validTo),
    };
  }

  async update(id: string, userId: string, userRole: string, dto: Partial<CreateWarningDto>) {
    const warning = await this.prisma.warning.findUnique({
      where: { id },
      select: { issuerId: true }
    });

    if (!warning) {
      throw new NotFoundException('Warning not found');
    }

    // Only issuer, admin, or marine worker can update
    if (warning.issuerId !== userId && !['admin', 'marine_worker'].includes(userRole)) {
      throw new ForbiddenException('Not authorized to update this warning');
    }

    const updateData: any = {};
    
    if (dto.type) updateData.type = dto.type;
    if (dto.message) {
      updateData.message = dto.message;
      updateData.message_i18n = { en: dto.message };
    }
    if (dto.severity) updateData.severity = dto.severity;
    if (dto.validFrom) updateData.validFrom = new Date(dto.validFrom);
    if (dto.validTo) updateData.validTo = new Date(dto.validTo);
    if (dto.area) {
      const areaWkt = `POLYGON((${dto.area.coordinates[0].map((coord: number[]) => 
        `${coord[0]} ${coord[1]}`
      ).join(', ')}))`;
      updateData.area = areaWkt;
    }

    const updatedWarning = await this.prisma.warning.update({
      where: { id },
      data: updateData,
      include: {
        issuer: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    return {
      ...updatedWarning,
      area: dto.area || {
        type: 'Polygon',
        coordinates: [[[80.1, 13.0], [80.2, 13.0], [80.2, 13.1], [80.1, 13.1], [80.1, 13.0]]]
      },
      translations: updatedWarning.message_i18n || { en: updatedWarning.message },
      status: this.getWarningStatus(updatedWarning.validFrom, updatedWarning.validTo),
    };
  }

  async remove(id: string, userId: string, userRole: string) {
    const warning = await this.prisma.warning.findUnique({
      where: { id },
      select: { issuerId: true }
    });

    if (!warning) {
      throw new NotFoundException('Warning not found');
    }

    // Only issuer or admin can delete
    if (warning.issuerId !== userId && !['admin'].includes(userRole)) {
      throw new ForbiddenException('Not authorized to delete this warning');
    }

    await this.prisma.warning.delete({
      where: { id }
    });

    return { message: 'Warning deleted successfully' };
  }

  async getNearby(lat: number, lng: number, radiusMeters = 50000) {
    // Get nearby active warnings using PostGIS
    const nearbyWarnings = await this.prisma.$queryRaw`
      SELECT 
        w.*,
        ST_Distance(w.area, ST_GeomFromText('POINT(${lng} ${lat})', 4326)) as distance
      FROM "Warning" w
      WHERE ST_DWithin(w.area, ST_GeomFromText('POINT(${lng} ${lat})', 4326), ${radiusMeters})
        AND w."validFrom" <= NOW()
        AND w."validTo" >= NOW()
      ORDER BY w.severity DESC, distance ASC
    `;

    return nearbyWarnings;
  }

  async getStats() {
    const total = await this.prisma.warning.count();
    const active = await this.prisma.warning.count({
      where: {
        validFrom: { lte: new Date() },
        validTo: { gte: new Date() }
      }
    });
    const expired = await this.prisma.warning.count({
      where: {
        validTo: { lt: new Date() }
      }
    });

    const byType = await this.prisma.warning.groupBy({
      by: ['type'],
      _count: { type: true }
    });

    const bySeverity = await this.prisma.warning.groupBy({
      by: ['severity'],
      _count: { severity: true }
    });

    return {
      total,
      active,
      expired,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>),
      bySeverity: bySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count.severity;
        return acc;
      }, {} as Record<number, number>),
    };
  }

  private getWarningStatus(validFrom: Date, validTo: Date): string {
    const now = new Date();
    if (now < validFrom) return 'scheduled';
    if (now > validTo) return 'expired';
    return 'active';
  }
}
