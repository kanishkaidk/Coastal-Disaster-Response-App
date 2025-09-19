import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        role: import(".prisma/client").$Enums.Role;
        phone: string;
        name: string | null;
        language: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: UserQueryDto): Promise<{
        role: import(".prisma/client").$Enums.Role;
        phone: string;
        name: string | null;
        language: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            reports: number;
            forumPosts: number;
            sos: number;
            resourceReqs: number;
        };
    }[]>;
    getById(id: string): Promise<{
        role: import(".prisma/client").$Enums.Role;
        phone: string;
        name: string | null;
        language: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            reports: number;
            forumPosts: number;
            sos: number;
            resourceReqs: number;
            warningsIssued: number;
            forumComments: number;
            forumReactions: number;
        };
    }>;
    update(id: string, dto: UpdateUserDto, currentUserId: string, currentUserRole: string): Promise<{
        role: import(".prisma/client").$Enums.Role;
        phone: string;
        name: string | null;
        language: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, currentUserId: string, currentUserRole: string): Promise<{
        message: string;
    }>;
    getStats(id: string): Promise<{
        user: {
            id: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        stats: {
            reports: number;
            forumPosts: number;
            sos: number;
            resourceReqs: number;
            warningsIssued: number;
            forumComments: number;
            forumReactions: number;
        };
    }>;
}
