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
        data: any[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
            hasMore: boolean;
        };
    }>;
    getNearby(lat: string, lng: string, radius?: string): Promise<{
        app: string;
        data: any;
    }>;
    getStats(): Promise<{
        app: string;
        data: {
            total: any;
            active: any;
            expired: any;
            byType: any;
            bySeverity: any;
        };
    }>;
    findOne(id: string): Promise<{
        app: string;
        data: any;
    }>;
    update(id: string, dto: Partial<CreateWarningDto>, req: any): Promise<{
        app: string;
        data: any;
    }>;
    remove(id: string, req: any): Promise<{
        app: string;
        data: {
            message: string;
        };
    }>;
}
