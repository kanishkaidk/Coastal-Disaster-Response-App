import { WarningService } from './warning.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { WarningQueryDto } from './dto/warning-query.dto';
export declare class WarningController {
    private readonly warningService;
    constructor(warningService: WarningService);
    create(req: any, dto: CreateWarningDto): Promise<{
        app: string;
        data: any;
    }>;
    findAll(query: WarningQueryDto): Promise<{
        app: string;
        data: {
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
        }[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
            hasMore: boolean;
        };
    }>;
    getNearby(lat: string, lng: string, radius?: string): Promise<{
        app: string;
        data: unknown;
    }>;
    getStats(): Promise<{
        app: string;
        data: {
            total: number;
            active: number;
            expired: number;
            byType: Record<string, number>;
            bySeverity: Record<number, number>;
        };
    }>;
    findOne(id: string): Promise<{
        app: string;
        data: {
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
        };
    }>;
    update(id: string, dto: Partial<CreateWarningDto>, req: any): Promise<{
        app: string;
        data: {
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
        };
    }>;
    remove(id: string, req: any): Promise<{
        app: string;
        data: {
            message: string;
        };
    }>;
}
