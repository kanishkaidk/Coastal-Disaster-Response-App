import { MarineWorkerService } from './marine-worker.service';
import { CreateMarineWorkerDto } from './dto/create-marine-worker.dto';
import { UpdateWorkDetailsDto } from './dto/update-work-details.dto';
import { CreateWarningDto } from './dto/create-warning.dto';
export declare class MarineWorkerController {
    private readonly marineWorkerService;
    constructor(marineWorkerService: MarineWorkerService);
    verifyMarineWorker(req: any, createMarineWorkerDto: CreateMarineWorkerDto): Promise<{
        user: {
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            name: string | null;
            language: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        phone: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        workToday: string | null;
        observations: string | null;
        isVerified: boolean;
    }>;
    getProfile(req: any): Promise<{
        user: {
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            name: string | null;
            language: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        warnings: {
            description: string;
            id: string;
            createdAt: Date;
            severity: number;
            marineWorkerId: string;
        }[];
    } & {
        phone: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        workToday: string | null;
        observations: string | null;
        isVerified: boolean;
    }>;
    updateWorkDetails(req: any, updateWorkDetailsDto: UpdateWorkDetailsDto): Promise<{
        user: {
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            name: string | null;
            language: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        phone: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        workToday: string | null;
        observations: string | null;
        isVerified: boolean;
    }>;
    createWarning(req: any, createWarningDto: CreateWarningDto): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        severity: number;
        marineWorkerId: string;
    }>;
    getWarnings(req: any): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        severity: number;
        marineWorkerId: string;
    }[]>;
    getAllMarineWorkers(): Promise<({
        user: {
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            name: string | null;
            language: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        warnings: {
            description: string;
            id: string;
            createdAt: Date;
            severity: number;
            marineWorkerId: string;
        }[];
    } & {
        phone: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        workToday: string | null;
        observations: string | null;
        isVerified: boolean;
    })[]>;
}
