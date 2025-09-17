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
exports.ForumService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_service_1 = require("../queue/queue.service");
let ForumService = class ForumService {
    prisma;
    queue;
    constructor(prisma, queue) {
        this.prisma = prisma;
        this.queue = queue;
    }
    async create(userId, dto) {
        const locationWkt = dto.location
            ? `POINT(${dto.location.lng} ${dto.location.lat})`
            : null;
        const post = await this.prisma.forumPost.create({
            data: {
                userId,
                type: dto.type,
                content: dto.content,
                mediaUrl: dto.mediaUrl,
                location: locationWkt,
                urgencyScore: dto.urgencyScore,
                language: dto.language || 'en',
                aiStatus: 'pending',
            },
            include: {
                user: {
                    select: { id: true, name: true, role: true, language: true }
                },
                _count: {
                    select: { comments: true, reactions: true }
                }
            }
        });
        // Enqueue for AI processing
        await this.queue.enqueueSync({
            type: 'forum_post_ai',
            postId: post.id,
            content: dto.content,
            language: dto.language || 'en',
        });
        return {
            ...post,
            trustScore: 0,
            moderationFlags: [],
            rationale: null,
            translations: {},
            summary: null,
        };
    }
    async findAll(query, userId) {
        const where = {
            status: query.status || 'active',
        };
        if (query.type)
            where.type = query.type;
        if (query.language)
            where.language = query.language;
        if (query.author)
            where.userId = query.author;
        if (query.minUrgency)
            where.urgencyScore = { gte: query.minUrgency };
        if (query.minTrust)
            where.trustScore = { gte: query.minTrust };
        if (query.search) {
            where.content = {
                contains: query.search,
                mode: 'insensitive'
            };
        }
        if (query.lat && query.lng) {
            // Geo radius search using PostGIS
            where.location = {
                st_dwithin: {
                    geometry: `POINT(${query.lng} ${query.lat})`,
                    distance: query.radius || 10000
                }
            };
        }
        const orderBy = {};
        if (query.sortBy === 'proximity' && query.lat && query.lng) {
            // Order by distance using PostGIS
            orderBy.location = {
                st_distance: `POINT(${query.lng} ${query.lat})`
            };
        }
        else {
            orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';
        }
        const posts = await this.prisma.forumPost.findMany({
            where,
            orderBy,
            take: query.limit || 20,
            skip: query.offset || 0,
            include: {
                user: {
                    select: { id: true, name: true, role: true, language: true }
                },
                comments: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { id: true, name: true, role: true }
                        }
                    }
                },
                reactions: {
                    include: {
                        user: {
                            select: { id: true, name: true }
                        }
                    }
                },
                _count: {
                    select: { comments: true, reactions: true }
                }
            }
        });
        return posts.map(post => ({
            ...post,
            trustScore: post.trustScore || 0,
            moderationFlags: post.moderationFlags || [],
            rationale: post.rationale || null,
            translations: post.translations || {},
            summary: post.summary || null,
        }));
    }
    async findOne(id) {
        const post = await this.prisma.forumPost.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, role: true, language: true }
                },
                comments: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: { id: true, name: true, role: true }
                        }
                    }
                },
                reactions: {
                    include: {
                        user: {
                            select: { id: true, name: true }
                        }
                    }
                },
                _count: {
                    select: { comments: true, reactions: true }
                }
            }
        });
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        return {
            ...post,
            trustScore: post.trustScore || 0,
            moderationFlags: post.moderationFlags || [],
            rationale: post.rationale || null,
            translations: post.translations || {},
            summary: post.summary || null,
        };
    }
    async update(id, userId, dto, userRole) {
        const post = await this.prisma.forumPost.findUnique({
            where: { id },
            select: { userId: true, status: true }
        });
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        // Check permissions
        if (post.userId !== userId && !['admin', 'moderator'].includes(userRole)) {
            throw new common_1.ForbiddenException('Not authorized to update this post');
        }
        const locationWkt = dto.location
            ? `POINT(${dto.location.lng} ${dto.location.lat})`
            : undefined;
        const updatedPost = await this.prisma.forumPost.update({
            where: { id },
            data: {
                ...dto,
                location: locationWkt,
                aiStatus: dto.content ? 'pending' : undefined, // Re-process if content changed
            },
            include: {
                user: {
                    select: { id: true, name: true, role: true, language: true }
                },
                _count: {
                    select: { comments: true, reactions: true }
                }
            }
        });
        // Re-enqueue for AI processing if content changed
        if (dto.content) {
            await this.queue.enqueueSync({
                type: 'forum_post_ai',
                postId: id,
                content: dto.content,
                language: dto.language || 'en',
            });
        }
        return {
            ...updatedPost,
            trustScore: updatedPost.trustScore || 0,
            moderationFlags: updatedPost.moderationFlags || [],
            rationale: updatedPost.rationale || null,
            translations: updatedPost.translations || {},
            summary: updatedPost.summary || null,
        };
    }
    async remove(id, userId, userRole) {
        const post = await this.prisma.forumPost.findUnique({
            where: { id },
            select: { userId: true }
        });
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        // Check permissions
        if (post.userId !== userId && !['admin', 'moderator'].includes(userRole)) {
            throw new common_1.ForbiddenException('Not authorized to delete this post');
        }
        await this.prisma.forumPost.delete({
            where: { id }
        });
        return { message: 'Post deleted successfully' };
    }
    async addComment(postId, userId, dto) {
        const post = await this.prisma.forumPost.findUnique({
            where: { id: postId }
        });
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        const comment = await this.prisma.forumComment.create({
            data: {
                postId,
                userId,
                content: dto.content,
                language: dto.language || 'en',
            },
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                }
            }
        });
        return comment;
    }
    async getComments(postId, limit = 20, offset = 0) {
        const comments = await this.prisma.forumComment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            take: limit,
            skip: offset,
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                }
            }
        });
        return comments;
    }
    async addReaction(postId, userId, dto) {
        const post = await this.prisma.forumPost.findUnique({
            where: { id: postId }
        });
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        // Check if user already reacted with this emoji
        const existingReaction = await this.prisma.forumReaction.findUnique({
            where: {
                postId_userId_emoji: {
                    postId,
                    userId,
                    emoji: dto.emoji
                }
            }
        });
        if (existingReaction) {
            // Toggle off
            await this.prisma.forumReaction.delete({
                where: {
                    postId_userId_emoji: {
                        postId,
                        userId,
                        emoji: dto.emoji
                    }
                }
            });
            return { message: 'Reaction removed' };
        }
        else {
            // Add reaction
            await this.prisma.forumReaction.create({
                data: {
                    postId,
                    userId,
                    emoji: dto.emoji,
                }
            });
            return { message: 'Reaction added' };
        }
    }
    async getFeed(userId, query) {
        // Personalized feed with AI ranking
        const posts = await this.findAll(query, userId);
        // TODO: Implement AI-based ranking algorithm
        // For now, return posts sorted by trust score and recency
        return posts.sort((a, b) => {
            const trustDiff = (b.trustScore || 0) - (a.trustScore || 0);
            if (trustDiff !== 0)
                return trustDiff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
    async getModerationQueue(userRole) {
        if (!['admin', 'moderator'].includes(userRole)) {
            throw new common_1.ForbiddenException('Not authorized to view moderation queue');
        }
        return this.prisma.forumPost.findMany({
            where: {
                OR: [
                    { status: 'under_review' },
                    { trustScore: { lt: 30 } },
                    { moderationFlags: { not: null } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                },
                _count: {
                    select: { comments: true, reactions: true }
                }
            }
        });
    }
    async moderatePost(id, action, userRole, reason) {
        if (!['admin', 'moderator'].includes(userRole)) {
            throw new common_1.ForbiddenException('Not authorized to moderate posts');
        }
        const updateData = {};
        switch (action) {
            case 'approve':
                updateData.status = 'active';
                updateData.hidden = false;
                break;
            case 'hide':
                updateData.hidden = true;
                break;
            case 'remove':
                updateData.status = 'removed';
                break;
        }
        const post = await this.prisma.forumPost.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                }
            }
        });
        return {
            ...post,
            moderationAction: action,
            reason,
            moderatedAt: new Date(),
        };
    }
};
exports.ForumService = ForumService;
exports.ForumService = ForumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], ForumService);
//# sourceMappingURL=forum.service.js.map