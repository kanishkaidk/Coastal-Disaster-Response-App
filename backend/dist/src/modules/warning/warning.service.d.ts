import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { WarningQueryDto } from './dto/warning-query.dto';
export declare class WarningService {
    private readonly prisma;
    private readonly queue;
    constructor(prisma: PrismaService, queue: QueueService);
    create(userId: string, userRole: string, dto: CreateWarningDto): Promise<any>;
    findAll(query: WarningQueryDto): Promise<{
        area: {
            type: string;
            coordinates: number[][][];
        };
        translations: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        status: string;
        issuer: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            id: string;
        };
        type: string;
        id: string;
        createdAt: Date;
        message: string;
        severity: number;
        validFrom: Date;
        validTo: Date;
        issuerId: string;
        sourceRole: import(".prisma/client").$Enums.Role;
        message_i18n: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    findOne(id: string): Promise<{
        area: {
            type: string;
            coordinates: number[][][];
        };
        translations: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        status: string;
        issuer: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            id: string;
        };
        type: string;
        id: string;
        createdAt: Date;
        message: string;
        severity: number;
        validFrom: Date;
        validTo: Date;
        issuerId: string;
        sourceRole: import(".prisma/client").$Enums.Role;
        message_i18n: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, userId: string, userRole: string, dto: Partial<CreateWarningDto>): Promise<{
        area: any;
        translations: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        status: string;
        issuer: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            id: string;
        };
        type: string;
        id: string;
        createdAt: Date;
        message: string;
        severity: number;
        validFrom: Date;
        validTo: Date;
        issuerId: string;
        sourceRole: import(".prisma/client").$Enums.Role;
        message_i18n: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    getNearby(lat: number, lng: number, radiusMeters?: number): Promise<unknown>;
    getStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        byType: Record<string, number>;
        bySeverity: Record<number, number>;
    }>;
    private getWarningStatus;
}
