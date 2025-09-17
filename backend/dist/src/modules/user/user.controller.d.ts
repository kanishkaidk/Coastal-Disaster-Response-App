import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
export declare class UserController {
    private readonly users;
    constructor(users: UserService);
    create(dto: CreateUserDto): Promise<{
        app: string;
        data: any;
    }>;
    findAll(query: UserQueryDto): Promise<{
        app: string;
        data: any;
        pagination: {
            limit: number;
            offset: number;
            total: any;
            hasMore: boolean;
        };
    }>;
    getOne(id: string): Promise<{
        app: string;
        data: any;
    }>;
    getStats(id: string): Promise<{
        app: string;
        data: {
            user: {
                id: any;
                name: any;
                role: any;
            };
            stats: any;
        };
    }>;
    update(id: string, dto: UpdateUserDto, req: any): Promise<{
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
