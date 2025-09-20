import { SosService } from './sos.service';
import { CreateSosDto } from './dto/create-sos.dto';
export declare class SosController {
    private readonly sosService;
    constructor(sosService: SosService);
    create(req: any, dto: CreateSosDto): Promise<{
        app: string;
        data: {
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
        };
    }>;
    findAll(limit?: string, offset?: string, req?: any): Promise<{
        app: string;
        data: ({
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
        })[];
    }>;
    getNearby(lat: string, lng: string, radius?: string): Promise<{
        app: string;
        data: unknown;
    }>;
    getStats(): Promise<{
        app: string;
        data: {
            total: number;
            delivered: number;
            pending: number;
            deliveryRate: number;
            byChannel: Record<string, number>;
        };
    }>;
    findOne(id: string): Promise<{
        app: string;
        data: {
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
        };
    }>;
}
