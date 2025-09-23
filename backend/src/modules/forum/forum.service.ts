import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { QueueService } from '../queue/queue.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { ForumQueryDto } from './dto/forum-query.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';

@Injectable()
export class ForumService {
  private get prismaClient(): any {
    return this.prisma as any;
  }

  constructor(
    private readonly prisma: PrismaService,
    // private readonly queue: QueueService,
  ) {}

  async create(userId: string, dto: CreateForumPostDto) {
    const locationWkt = dto.location 
      ? `POINT(${dto.location.lng} ${dto.location.lat})`
      : null;

    const post = await this.prismaClient.forumPost.create({
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
    // await this.queue.enqueueSync({
    //   type: 'forum_post_ai',
    //   postId: post.id,
    //   content: dto.content,
    //   language: dto.language || 'en',
    // });

    return {
      ...post,
      trustScore: 0,
      moderationFlags: [],
      rationale: null,
      translations: {},
      summary: null,
    };
  }

  async findAll(query: ForumQueryDto, userId?: string) {
    const where: any = {
      status: query.status || 'active',
    };

    if (query.type) where.type = query.type;
    if (query.language) where.language = query.language;
    if (query.author) where.userId = query.author;
    if (query.minUrgency) where.urgencyScore = { gte: query.minUrgency };
    if (query.minTrust) where.trustScore = { gte: query.minTrust };

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

    const orderBy: any = {};
    if (query.sortBy === 'proximity' && query.lat && query.lng) {
      // Order by distance using PostGIS
      orderBy.location = {
        st_distance: `POINT(${query.lng} ${query.lat})`
      };
    } else {
      orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';
    }

    const posts = await this.prismaClient.forumPost.findMany({
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

    return posts.map((post: any) => ({
      ...post,
      trustScore: post.trustScore || 0,
      moderationFlags: post.moderationFlags || [],
      rationale: post.rationale || null,
      translations: post.translations || {},
      summary: post.summary || null,
    }));
  }

  async findOne(id: string) {
    const post = await this.prismaClient.forumPost.findUnique({
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
      throw new NotFoundException('Forum post not found');
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

  async update(id: string, userId: string, dto: UpdateForumPostDto, userRole: string) {
    const post = await this.prismaClient.forumPost.findUnique({
      where: { id },
      select: { userId: true, status: true }
    });

    if (!post) {
      throw new NotFoundException('Forum post not found');
    }

    // Check permissions
    if (post.userId !== userId && !['admin', 'moderator'].includes(userRole)) {
      throw new ForbiddenException('Not authorized to update this post');
    }

    const locationWkt = dto.location 
      ? `POINT(${dto.location.lng} ${dto.location.lat})`
      : undefined;

    const updatedPost = await this.prismaClient.forumPost.update({
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
      // await this.queue.enqueueSync({
      //   type: 'forum_post_ai',
      //   postId: id,
      //   content: dto.content,
      //   language: dto.language || 'en',
      // });
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

  async remove(id: string, userId: string, userRole: string) {
    const post = await this.prismaClient.forumPost.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!post) {
      throw new NotFoundException('Forum post not found');
    }

    // Check permissions
    if (post.userId !== userId && !['admin', 'moderator'].includes(userRole)) {
      throw new ForbiddenException('Not authorized to delete this post');
    }

    await this.prismaClient.forumPost.delete({
      where: { id }
    });

    return { message: 'Post deleted successfully' };
  }

  async addComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.prismaClient.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('Forum post not found');
    }

    const comment = await this.prismaClient.forumComment.create({
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

  async getComments(postId: string, limit = 20, offset = 0) {
    const comments = await this.prismaClient.forumComment.findMany({
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

  async addReaction(postId: string, userId: string, dto: CreateReactionDto) {
    const post = await this.prismaClient.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('Forum post not found');
    }

    // Check if user already reacted with this emoji
    const existingReaction = await this.prismaClient.forumReaction.findUnique({
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
      await this.prismaClient.forumReaction.delete({
        where: {
          postId_userId_emoji: {
            postId,
            userId,
            emoji: dto.emoji
          }
        }
      });
      return { message: 'Reaction removed' };
    } else {
      // Add reaction
      await this.prismaClient.forumReaction.create({
        data: {
          postId,
          userId,
          emoji: dto.emoji,
        }
      });
      return { message: 'Reaction added' };
    }
  }

  async getFeed(userId: string, query: ForumQueryDto) {
    // Personalized feed with AI ranking
    const posts = await this.findAll(query, userId);
    
    // TODO: Implement AI-based ranking algorithm
    // For now, return posts sorted by trust score and recency
    return posts.sort((a: any, b: any) => {
      const trustDiff = (b.trustScore || 0) - (a.trustScore || 0);
      if (trustDiff !== 0) return trustDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getModerationQueue(userRole: string) {
    if (!['admin', 'moderator'].includes(userRole)) {
      throw new ForbiddenException('Not authorized to view moderation queue');
    }

    return this.prismaClient.forumPost.findMany({
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

  async moderatePost(id: string, action: 'approve' | 'hide' | 'remove', userRole: string, reason?: string) {
    if (!['admin', 'moderator'].includes(userRole)) {
      throw new ForbiddenException('Not authorized to moderate posts');
    }

    const updateData: any = {};
    
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

    const post = await this.prismaClient.forumPost.update({
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
}
