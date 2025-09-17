import { ForumService } from './forum.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { ForumQueryDto } from './dto/forum-query.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';
export declare class ForumController {
    private readonly forumService;
    constructor(forumService: ForumService);
    create(req: any, dto: CreateForumPostDto): Promise<{
        app: string;
        data: any;
    }>;
    findAll(query: ForumQueryDto, req?: any): Promise<{
        app: string;
        data: any;
        pagination: {
            limit: number;
            offset: number;
            total: any;
            hasMore: boolean;
        };
    }>;
    getFeed(query: ForumQueryDto, req: any): Promise<{
        app: string;
        data: any;
    }>;
    getModerationQueue(req: any): Promise<{
        app: string;
        data: any;
    }>;
    findOne(id: string): Promise<{
        app: string;
        data: any;
    }>;
    update(id: string, dto: UpdateForumPostDto, req: any): Promise<{
        app: string;
        data: any;
    }>;
    remove(id: string, req: any): Promise<{
        app: string;
        data: {
            message: string;
        };
    }>;
    addComment(postId: string, dto: CreateCommentDto, req: any): Promise<{
        app: string;
        data: any;
    }>;
    getComments(postId: string, limit?: string, offset?: string): Promise<{
        app: string;
        data: any;
    }>;
    addReaction(postId: string, dto: CreateReactionDto, req: any): Promise<{
        app: string;
        data: {
            message: string;
        };
    }>;
    moderatePost(id: string, body: {
        action: 'approve' | 'hide' | 'remove';
        reason?: string;
    }, req: any): Promise<{
        app: string;
        data: any;
    }>;
}
