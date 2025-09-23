import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { QueueService } from '../queue/queue.service';
import { CreateSosDto } from './dto/create-sos.dto';

@Injectable()
export class SosService {
  private get prismaClient(): any {
    return this.prisma as any;
  }

  constructor(
    private readonly prisma: PrismaService,
    // private readonly queue: QueueService,
  ) {}

  async create(userId: string, dto: CreateSosDto) {
    const locationWkt = `POINT(${dto.location.lng} ${dto.location.lat})`;

    // Create SOS record
    const sos = await this.prismaClient.sOS.create({
      data: {
        userId,
        message: dto.message,
        location: locationWkt,
        mediaUrl: dto.mediaUrl,
        delivered: false,
        channel: 'pending',
      },
      include: {
        user: {
          select: { id: true, name: true, phone: true, role: true }
        }
      }
    });

    // Try delivery methods in order: Internet -> Mesh -> SMS -> Call
    const deliveryResult = await this.tryDeliveryMethods(sos);

    // Update SOS with delivery status
    const updatedSos = await this.prismaClient.sOS.update({
      where: { id: sos.id },
      data: {
        delivered: deliveryResult.delivered,
        channel: deliveryResult.channel,
      }
    });

    return {
      ...updatedSos,
      deliveryStatus: deliveryResult,
    };
  }

  async findAll(userId?: string, limit = 20, offset = 0) {
    const where = userId ? { userId } : {};

    const sosList = await this.prismaClient.sOS.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    return sosList;
  }

  async findOne(id: string) {
    const sos = await this.prismaClient.sOS.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, phone: true, role: true }
        }
      }
    });

    if (!sos) {
      throw new NotFoundException('SOS not found');
    }

    return sos;
  }

  async getNearby(lat: number, lng: number, radiusMeters = 5000) {
    // Get nearby SOS alerts using PostGIS
    const nearbySos = await this.prismaClient.$queryRaw`
      SELECT 
        s.*,
        ST_Distance(s.location, ST_GeomFromText('POINT(${lng} ${lat})', 4326)) as distance
      FROM "SOS" s
      WHERE ST_DWithin(s.location, ST_GeomFromText('POINT(${lng} ${lat})', 4326), ${radiusMeters})
      ORDER BY distance ASC
    `;

    return nearbySos;
  }

  private async tryDeliveryMethods(sos: any): Promise<{
    delivered: boolean;
    channel: string;
    attempts: Array<{ method: string; success: boolean; error?: string }>;
  }> {
    const attempts = [];
    const methods = [
      { name: 'internet', priority: 1 },
      { name: 'mesh', priority: 2 },
      { name: 'sms', priority: 3 },
      { name: 'call', priority: 4 },
    ];

    for (const method of methods) {
      try {
        const success = await this.tryDeliveryMethod(method.name, sos);
        attempts.push({ method: method.name, success, error: success ? undefined : 'Failed' });
        
        if (success) {
          return {
            delivered: true,
            channel: method.name,
            attempts,
          };
        }
      } catch (error) {
        attempts.push({ 
          method: method.name, 
          success: false, 
          error: (error as Error).message 
        });
      }
    }

    return {
      delivered: false,
      channel: 'failed',
      attempts,
    };
  }

  private async tryDeliveryMethod(method: string, sos: any): Promise<boolean> {
    switch (method) {
      case 'internet':
        return this.deliverViaInternet(sos);
      case 'mesh':
        return this.deliverViaMesh(sos);
      case 'sms':
        return this.deliverViaSMS(sos);
      case 'call':
        return this.deliverViaCall(sos);
      default:
        return false;
    }
  }

  private async deliverViaInternet(sos: any): Promise<boolean> {
    try {
      // Simulate internet delivery (push notification, webhook, etc.)
      // In production, integrate with push notification service
      console.log(`SOS delivered via internet: ${sos.id}`);
      
      // Enqueue for emergency response team notification
      // await this.queue.enqueueSync({
      //   type: 'sos_emergency',
      //   sosId: sos.id,
      //   userId: sos.userId,
      //   message: sos.message,
      //   location: sos.location,
      //   priority: 'critical',
      // });

      return true;
    } catch (error) {
      console.error('Internet delivery failed:', error);
      return false;
    }
  }

  private async deliverViaMesh(sos: any): Promise<boolean> {
    try {
      // Simulate mesh network delivery
      // In production, integrate with mesh networking service
      console.log(`SOS delivered via mesh: ${sos.id}`);
      
      // Enqueue for mesh relay
      // await this.queue.enqueueSync({
      //   type: 'sos_mesh',
      //   sosId: sos.id,
      //   userId: sos.userId,
      //   message: sos.message,
      //   location: sos.location,
      //   priority: 'critical',
      // });

      return true;
    } catch (error) {
      console.error('Mesh delivery failed:', error);
      return false;
    }
  }

  private async deliverViaSMS(sos: any): Promise<boolean> {
    try {
      // Simulate SMS delivery
      // In production, integrate with SMS service (Twilio, etc.)
      const message = `SOS ALERT: ${sos.message || 'Emergency assistance needed'} - Location: ${sos.location} - From: ${sos.user.name} (${sos.user.phone})`;
      
      console.log(`SOS delivered via SMS: ${sos.id}`);
      console.log(`SMS Message: ${message}`);
      
      // In production, send actual SMS to emergency contacts
      // await this.smsService.send(emergencyContact, message);

      return true;
    } catch (error) {
      console.error('SMS delivery failed:', error);
      return false;
    }
  }

  private async deliverViaCall(sos: any): Promise<boolean> {
    try {
      // Simulate call delivery
      // In production, integrate with calling service
      console.log(`SOS delivered via call: ${sos.id}`);
      
      // In production, initiate call to emergency services
      // await this.callService.initiate(emergencyNumber, sos);

      return true;
    } catch (error) {
      console.error('Call delivery failed:', error);
      return false;
    }
  }

  async getStats() {
    const total = await this.prismaClient.sOS.count();
    const delivered = await this.prismaClient.sOS.count({ where: { delivered: true } });
    const pending = await this.prismaClient.sOS.count({ where: { delivered: false } });
    
    const byChannel = await this.prismaClient.sOS.groupBy({
      by: ['channel'],
      _count: { channel: true }
    });

    return {
      total,
      delivered,
      pending,
      deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
      byChannel: byChannel.reduce((acc: any, item: any) => {
        acc[item.channel] = item._count.channel;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
