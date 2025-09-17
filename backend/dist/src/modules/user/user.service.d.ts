import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<any>;
    findAll(query: UserQueryDto): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, dto: UpdateUserDto, currentUserId: string, currentUserRole: string): Promise<any>;
    remove(id: string, currentUserId: string, currentUserRole: string): Promise<{
        message: string;
    }>;
    getStats(id: string): Promise<{
        user: {
            id: any;
            name: any;
            role: any;
        };
        stats: any;
    }>;
}
