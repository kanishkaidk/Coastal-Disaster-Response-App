import { SosService } from './sos.service';
import { CreateSosDto } from './dto/create-sos.dto';
export declare class SosController {
    private readonly sosService;
    constructor(sosService: SosService);
    create(req: any, dto: CreateSosDto): Promise<{
        app: string;
        data: any;
    }>;
    findAll(limit?: string, offset?: string, req?: any): Promise<{
        app: string;
        data: any;
    }>;
    getNearby(lat: string, lng: string, radius?: string): Promise<{
        app: string;
        data: any;
    }>;
    getStats(): Promise<{
        app: string;
        data: {
            total: any;
            delivered: any;
            pending: any;
            deliveryRate: number;
            byChannel: any;
        };
    }>;
    findOne(id: string): Promise<{
        app: string;
        data: any;
    }>;
}
