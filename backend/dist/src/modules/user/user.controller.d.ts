import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
export declare class UserController {
    private readonly users;
    constructor(users: UserService);
    create(dto: CreateUserDto): Promise<{
        app: string;
        data: {
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            name: string | null;
            language: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(query: UserQueryDto): Promise<{
        app: string;
        data: {
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
        }[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
            hasMore: boolean;
        };
    }>;
    getOne(id: string): Promise<{
        app: string;
        data: {
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
        };
    }>;
    getStats(id: string): Promise<{
        app: string;
        data: {
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
        };
    }>;
    update(id: string, dto: UpdateUserDto, req: any): Promise<{
        app: string;
        data: {
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            name: string | null;
            language: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: string, req: any): Promise<{
        app: string;
        data: {
            message: string;
        };
    }>;
}
