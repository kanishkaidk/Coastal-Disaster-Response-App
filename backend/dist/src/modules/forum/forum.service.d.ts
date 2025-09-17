import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { ForumQueryDto } from './dto/forum-query.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';
export declare class ForumService {
    private readonly prisma;
    private readonly queue;
    constructor(prisma: PrismaService, queue: QueueService);
    create(userId: string, dto: CreateForumPostDto): Promise<any>;
    findAll(query: ForumQueryDto, userId?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, userId: string, dto: UpdateForumPostDto, userRole: string): Promise<any>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    addComment(postId: string, userId: string, dto: CreateCommentDto): Promise<any>;
    getComments(postId: string, limit?: number, offset?: number): Promise<any>;
    addReaction(postId: string, userId: string, dto: CreateReactionDto): Promise<{
        message: string;
    }>;
    getFeed(userId: string, query: ForumQueryDto): Promise<any>;
    getModerationQueue(userRole: string): Promise<any>;
    moderatePost(id: string, action: 'approve' | 'hide' | 'remove', userRole: string, reason?: string): Promise<any>;
}
