import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { WarningQueryDto } from './dto/warning-query.dto';
export declare class WarningService {
    private readonly prisma;
    private readonly queue;
    constructor(prisma: PrismaService, queue: QueueService);
    create(userId: string, userRole: string, dto: CreateWarningDto): Promise<any>;
    findAll(query: WarningQueryDto): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, userId: string, userRole: string, dto: Partial<CreateWarningDto>): Promise<any>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    getNearby(lat: number, lng: number, radiusMeters?: number): Promise<any>;
    getStats(): Promise<{
        total: any;
        active: any;
        expired: any;
        byType: any;
        bySeverity: any;
    }>;
    private getWarningStatus;
}
