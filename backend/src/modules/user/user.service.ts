import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
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

  async findAll(query: UserQueryDto) {
    const where: any = {};

    if (query.role) where.role = query.role;
    if (query.language) where.language = query.language;
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

  async getById(id: string) {
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
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string, currentUserRole: string) {
    // Check if user is updating themselves or is admin/moderator
    if (id !== currentUserId && !['admin', 'moderator'].includes(currentUserRole)) {
      throw new ForbiddenException('Not authorized to update this user');
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

  async remove(id: string, currentUserId: string, currentUserRole: string) {
    // Only admin can delete users
    if (!['admin'].includes(currentUserRole)) {
      throw new ForbiddenException('Not authorized to delete users');
    }

    if (id === currentUserId) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    await this.prisma.user.delete({
      where: { id }
    });

    return { message: 'User deleted successfully' };
  }

  async getStats(id: string) {
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
      throw new NotFoundException('User not found');
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
}


