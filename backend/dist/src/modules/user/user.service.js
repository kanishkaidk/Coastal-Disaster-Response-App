"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const user = await this.prisma.user.create({
            data: {
                phone: dto.phone,
                name: dto.name,
                role: dto.role || 'citizen',
                language: dto.language || 'en',
            },
            select: {
                id: true,
                phone: true,
                name: true,
                role: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return user;
    }
    async findAll(query) {
        const where = {};
        if (query.role)
            where.role = query.role;
        if (query.language)
            where.language = query.language;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search } }
            ];
        }
        const users = await this.prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: query.limit || 20,
            skip: query.offset || 0,
            select: {
                id: true,
                phone: true,
                name: true,
                role: true,
                language: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        reports: true,
                        forumPosts: true,
                        sos: true,
                        resourceReqs: true,
                    }
                }
            }
        });
        return users;
    }
    async getById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                phone: true,
                name: true,
                role: true,
                language: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        reports: true,
                        forumPosts: true,
                        sos: true,
                        resourceReqs: true,
                        warningsIssued: true,
                        forumComments: true,
                        forumReactions: true,
                    }
                }
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, dto, currentUserId, currentUserRole) {
        // Check if user is updating themselves or is admin/moderator
        if (id !== currentUserId && !['admin', 'moderator'].includes(currentUserRole)) {
            throw new common_1.ForbiddenException('Not authorized to update this user');
        }
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                name: dto.name,
                language: dto.language,
                role: ['admin'].includes(currentUserRole) ? dto.role : undefined, // Only admin can change roles
            },
            select: {
                id: true,
                phone: true,
                name: true,
                role: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return user;
    }
    async remove(id, currentUserId, currentUserRole) {
        // Only admin can delete users
        if (!['admin'].includes(currentUserRole)) {
            throw new common_1.ForbiddenException('Not authorized to delete users');
        }
        if (id === currentUserId) {
            throw new common_1.ForbiddenException('Cannot delete your own account');
        }
        await this.prisma.user.delete({
            where: { id }
        });
        return { message: 'User deleted successfully' };
    }
    async getStats(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                role: true,
                _count: {
                    select: {
                        reports: true,
                        forumPosts: true,
                        sos: true,
                        resourceReqs: true,
                        warningsIssued: true,
                        forumComments: true,
                        forumReactions: true,
                    }
                }
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
            stats: user._count
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map