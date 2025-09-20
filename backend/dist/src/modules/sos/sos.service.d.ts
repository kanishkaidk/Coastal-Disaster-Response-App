import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateSosDto } from './dto/create-sos.dto';
export declare class SosService {
    private readonly prisma;
    private readonly queue;
    constructor(prisma: PrismaService, queue: QueueService);
    create(userId: string, dto: CreateSosDto): Promise<{
        deliveryStatus: {
            delivered: boolean;
            channel: string;
            attempts: Array<{
                method: string;
                success: boolean;
                error?: string;
            }>;
        };
        id: string;
        createdAt: Date;
        userId: string;
        message: string | null;
        delivered: boolean;
        channel: string;
    }>;
    findAll(userId?: string, limit?: number, offset?: number): Promise<({
        user: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        message: string | null;
        delivered: boolean;
        channel: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            name: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        message: string | null;
        delivered: boolean;
        channel: string;
    }>;
    getNearby(lat: number, lng: number, radiusMeters?: number): Promise<unknown>;
    private tryDeliveryMethods;
    private tryDeliveryMethod;
    private deliverViaInternet;
    private deliverViaMesh;
    private deliverViaSMS;
    private deliverViaCall;
    getStats(): Promise<{
        total: number;
        delivered: number;
        pending: number;
        deliveryRate: number;
        byChannel: Record<string, number>;
    }>;
}
