import { PrismaService } from '../prisma/prisma.service';
export declare class ReportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: {
        type: string;
        description: string;
        mediaUrl?: string;
        location: {
            lat: number;
            lng: number;
        };
    }): Promise<any>;
    listNearby(lat: number, lng: number, radiusMeters?: number): Promise<never[]>;
}
