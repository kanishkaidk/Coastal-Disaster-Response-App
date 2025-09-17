import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateSosDto } from './dto/create-sos.dto';
export declare class SosService {
    private readonly prisma;
    private readonly queue;
    constructor(prisma: PrismaService, queue: QueueService);
    create(userId: string, dto: CreateSosDto): Promise<any>;
    findAll(userId?: string, limit?: number, offset?: number): Promise<any>;
    findOne(id: string): Promise<any>;
    getNearby(lat: number, lng: number, radiusMeters?: number): Promise<any>;
    private tryDeliveryMethods;
    private tryDeliveryMethod;
    private deliverViaInternet;
    private deliverViaMesh;
    private deliverViaSMS;
    private deliverViaCall;
    getStats(): Promise<{
        total: any;
        delivered: any;
        pending: any;
        deliveryRate: number;
        byChannel: any;
    }>;
}
