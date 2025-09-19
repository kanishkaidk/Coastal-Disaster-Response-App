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
    create(userId: string, dto: CreateForumPostDto): Promise<{
        trustScore: number;
        moderationFlags: never[];
        rationale: null;
        translations: {};
        summary: null;
        status: string;
        content: string;
        type: string;
        language: string | null;
        id: string;
        createdAt: Date;
        mediaUrl: string | null;
        userId: string;
        content_i18n: import("@prisma/client/runtime/library").JsonValue | null;
        urgencyScore: number | null;
        aiStatus: string | null;
        hidden: boolean;
        pinned: boolean;
        locked: boolean;
    }>;
    findAll(query: ForumQueryDto, userId?: string): Promise<{
        trustScore: number;
        moderationFlags: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        rationale: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        translations: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        summary: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        user: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            language: string;
            id: string;
        };
        _count: {
            comments: number;
            reactions: number;
        };
        comments: ({
            user: {
                role: import(".prisma/client").$Enums.Role;
                name: string | null;
                id: string;
            };
        } & {
            content: string;
            language: string | null;
            id: string;
            createdAt: Date;
            postId: string;
            userId: string;
        })[];
        reactions: ({
            user: {
                name: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            postId: string;
            userId: string;
            emoji: string;
        })[];
        status: string;
        content: string;
        type: string;
        language: string | null;
        id: string;
        createdAt: Date;
        mediaUrl: string | null;
        userId: string;
        content_i18n: import("@prisma/client/runtime/library").JsonValue | null;
        urgencyScore: number | null;
        aiStatus: string | null;
        hidden: boolean;
        pinned: boolean;
        locked: boolean;
    }[]>;
    findOne(id: string): Promise<{
        trustScore: number;
        moderationFlags: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        rationale: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        translations: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        summary: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        user: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            language: string;
            id: string;
        };
        _count: {
            comments: number;
            reactions: number;
        };
        comments: ({
            user: {
                role: import(".prisma/client").$Enums.Role;
                name: string | null;
                id: string;
            };
        } & {
            content: string;
            language: string | null;
            id: string;
            createdAt: Date;
            postId: string;
            userId: string;
        })[];
        reactions: ({
            user: {
                name: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            postId: string;
            userId: string;
            emoji: string;
        })[];
        status: string;
        content: string;
        type: string;
        language: string | null;
        id: string;
        createdAt: Date;
        mediaUrl: string | null;
        userId: string;
        content_i18n: import("@prisma/client/runtime/library").JsonValue | null;
        urgencyScore: number | null;
        aiStatus: string | null;
        hidden: boolean;
        pinned: boolean;
        locked: boolean;
    }>;
    update(id: string, userId: string, dto: UpdateForumPostDto, userRole: string): Promise<{
        trustScore: number;
        moderationFlags: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        rationale: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        translations: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        summary: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        status: string;
        content: string;
        type: string;
        language: string | null;
        id: string;
        createdAt: Date;
        mediaUrl: string | null;
        userId: string;
        content_i18n: import("@prisma/client/runtime/library").JsonValue | null;
        urgencyScore: number | null;
        aiStatus: string | null;
        hidden: boolean;
        pinned: boolean;
        locked: boolean;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    addComment(postId: string, userId: string, dto: CreateCommentDto): Promise<{
        user: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            id: string;
        };
    } & {
        content: string;
        language: string | null;
        id: string;
        createdAt: Date;
        postId: string;
        userId: string;
    }>;
    getComments(postId: string, limit?: number, offset?: number): Promise<({
        user: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            id: string;
        };
    } & {
        content: string;
        language: string | null;
        id: string;
        createdAt: Date;
        postId: string;
        userId: string;
    })[]>;
    addReaction(postId: string, userId: string, dto: CreateReactionDto): Promise<{
        message: string;
    }>;
    getFeed(userId: string, query: ForumQueryDto): Promise<{
        trustScore: number;
        moderationFlags: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        rationale: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        translations: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        summary: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null;
        user: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            language: string;
            id: string;
        };
        _count: {
            comments: number;
            reactions: number;
        };
        comments: ({
            user: {
                role: import(".prisma/client").$Enums.Role;
                name: string | null;
                id: string;
            };
        } & {
            content: string;
            language: string | null;
            id: string;
            createdAt: Date;
            postId: string;
            userId: string;
        })[];
        reactions: ({
            user: {
                name: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            postId: string;
            userId: string;
            emoji: string;
        })[];
        status: string;
        content: string;
        type: string;
        language: string | null;
        id: string;
        createdAt: Date;
        mediaUrl: string | null;
        userId: string;
        content_i18n: import("@prisma/client/runtime/library").JsonValue | null;
        urgencyScore: number | null;
        aiStatus: string | null;
        hidden: boolean;
        pinned: boolean;
        locked: boolean;
    }[]>;
    getModerationQueue(userRole: string): Promise<{
        summary: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        content: string;
        type: string;
        language: string | null;
        id: string;
        createdAt: Date;
        mediaUrl: string | null;
        userId: string;
        content_i18n: import("@prisma/client/runtime/library").JsonValue | null;
        trustScore: number;
        urgencyScore: number | null;
        aiStatus: string | null;
        moderationFlags: import("@prisma/client/runtime/library").JsonValue | null;
        rationale: import("@prisma/client/runtime/library").JsonValue | null;
        translations: import("@prisma/client/runtime/library").JsonValue | null;
        hidden: boolean;
        pinned: boolean;
        locked: boolean;
    }[]>;
    moderatePost(id: string, action: 'approve' | 'hide' | 'remove', userRole: string, reason?: string): Promise<{
        moderationAction: "remove" | "approve" | "hide";
        reason: string | undefined;
        moderatedAt: Date;
        user: {
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            id: string;
        };
        summary: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        content: string;
        type: string;
        language: string | null;
        id: string;
        createdAt: Date;
        mediaUrl: string | null;
        userId: string;
        content_i18n: import("@prisma/client/runtime/library").JsonValue | null;
        trustScore: number;
        urgencyScore: number | null;
        aiStatus: string | null;
        moderationFlags: import("@prisma/client/runtime/library").JsonValue | null;
        rationale: import("@prisma/client/runtime/library").JsonValue | null;
        translations: import("@prisma/client/runtime/library").JsonValue | null;
        hidden: boolean;
        pinned: boolean;
        locked: boolean;
    }>;
}
