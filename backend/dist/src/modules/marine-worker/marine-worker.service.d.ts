import { PrismaService } from '../prisma/prisma.service';
import { CreateMarineWorkerDto } from './dto/create-marine-worker.dto';
import { UpdateWorkDetailsDto } from './dto/update-work-details.dto';
import { CreateWarningDto } from './dto/create-warning.dto';
export declare class MarineWorkerService {
    private prisma;
    constructor(prisma: PrismaService);
    createMarineWorker(userId: string, createMarineWorkerDto: CreateMarineWorkerDto): Promise<{
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
    getMarineWorker(userId: string): Promise<{
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
    updateWorkDetails(userId: string, updateWorkDetailsDto: UpdateWorkDetailsDto): Promise<{
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
    createWarning(userId: string, createWarningDto: CreateWarningDto): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        severity: number;
        marineWorkerId: string;
    }>;
    getWarnings(userId: string): Promise<{
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
