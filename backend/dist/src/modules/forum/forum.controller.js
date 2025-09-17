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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const forum_service_1 = require("./forum.service");
const create_forum_post_dto_1 = require("./dto/create-forum-post.dto");
const update_forum_post_dto_1 = require("./dto/update-forum-post.dto");
const forum_query_dto_1 = require("./dto/forum-query.dto");
const comment_dto_1 = require("./dto/comment.dto");
const reaction_dto_1 = require("./dto/reaction.dto");
let ForumController = class ForumController {
    forumService;
    constructor(forumService) {
        this.forumService = forumService;
    }
    async create(req, dto) {
        const userId = req.user?.userId;
        const data = await this.forumService.create(userId, dto);
        return { app: 'Coast-Kavach', data };
    }
    async findAll(query, req) {
        const userId = req?.user?.userId;
        const data = await this.forumService.findAll(query, userId);
        return {
            app: 'Coast-Kavach',
            data,
            pagination: {
                limit: query.limit || 20,
                offset: query.offset || 0,
                total: data.length,
                hasMore: data.length === (query.limit || 20)
            }
        };
    }
    async getFeed(query, req) {
        const userId = req.user?.userId;
        const data = await this.forumService.getFeed(userId, query);
        return { app: 'Coast-Kavach', data };
    }
    async getModerationQueue(req) {
        const userRole = req.user?.role;
        const data = await this.forumService.getModerationQueue(userRole);
        return { app: 'Coast-Kavach', data };
    }
    async findOne(id) {
        const data = await this.forumService.findOne(id);
        return { app: 'Coast-Kavach', data };
    }
    async update(id, dto, req) {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const data = await this.forumService.update(id, userId, dto, userRole);
        return { app: 'Coast-Kavach', data };
    }
    async remove(id, req) {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const data = await this.forumService.remove(id, userId, userRole);
        return { app: 'Coast-Kavach', data };
    }
    async addComment(postId, dto, req) {
        const userId = req.user?.userId;
        const data = await this.forumService.addComment(postId, userId, dto);
        return { app: 'Coast-Kavach', data };
    }
    async getComments(postId, limit, offset) {
        const data = await this.forumService.getComments(postId, limit ? parseInt(limit) : 20, offset ? parseInt(offset) : 0);
        return { app: 'Coast-Kavach', data };
    }
    async addReaction(postId, dto, req) {
        const userId = req.user?.userId;
        const data = await this.forumService.addReaction(postId, userId, dto);
        return { app: 'Coast-Kavach', data };
    }
    async moderatePost(id, body, req) {
        const userRole = req.user?.role;
        const data = await this.forumService.moderatePost(id, body.action, userRole, body.reason);
        return { app: 'Coast-Kavach', data };
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new forum post',
        description: 'Create a new forum post with optional media and location. AI processing is queued automatically.'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Forum post created successfully',
        schema: {
            type: 'object',
            properties: {
                app: { type: 'string', example: 'Coast-Kavach' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        type: { type: 'string', enum: ['help', 'info', 'offer'] },
                        content: { type: 'string' },
                        mediaUrl: { type: 'string' },
                        location: { type: 'object' },
                        urgencyScore: { type: 'number' },
                        language: { type: 'string' },
                        aiStatus: { type: 'string', enum: ['pending', 'ready', 'error'] },
                        trustScore: { type: 'number' },
                        moderationFlags: { type: 'array' },
                        rationale: { type: 'object' },
                        translations: { type: 'object' },
                        summary: { type: 'object' },
                        createdAt: { type: 'string', format: 'date-time' },
                        user: { type: 'object' },
                        _count: { type: 'object' }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_forum_post_dto_1.CreateForumPostDto]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List forum posts',
        description: 'Get paginated list of forum posts with filtering, sorting, and geo-radius search. No authentication required for viewing.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false, description: 'Latitude for geo search' }),
    (0, swagger_1.ApiQuery)({ name: 'lng', required: false, description: 'Longitude for geo search' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, description: 'Search radius in meters' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['help', 'info', 'offer'] }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['active', 'under_review', 'removed'] }),
    (0, swagger_1.ApiQuery)({ name: 'minUrgency', required: false, description: 'Minimum urgency score' }),
    (0, swagger_1.ApiQuery)({ name: 'minTrust', required: false, description: 'Minimum trust score' }),
    (0, swagger_1.ApiQuery)({ name: 'language', required: false, description: 'Language filter' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'author', required: false, description: 'Author user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, enum: ['createdAt', 'trustScore', 'urgencyScore', 'proximity'] }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Page limit' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Page offset' }),
    (0, swagger_1.ApiQuery)({ name: 'cursor', required: false, description: 'Pagination cursor' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of forum posts',
        schema: {
            type: 'object',
            properties: {
                app: { type: 'string', example: 'Coast-Kavach' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { type: 'string' },
                            content: { type: 'string' },
                            trustScore: { type: 'number' },
                            urgencyScore: { type: 'number' },
                            aiStatus: { type: 'string' },
                            moderationFlags: { type: 'array' },
                            rationale: { type: 'object' },
                            translations: { type: 'object' },
                            summary: { type: 'object' },
                            createdAt: { type: 'string', format: 'date-time' },
                            user: { type: 'object' },
                            _count: { type: 'object' }
                        }
                    }
                },
                pagination: {
                    type: 'object',
                    properties: {
                        limit: { type: 'number' },
                        offset: { type: 'number' },
                        total: { type: 'number' },
                        hasMore: { type: 'boolean' }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forum_query_dto_1.ForumQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('feed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get personalized feed',
        description: 'Get AI-ranked personalized feed of forum posts based on user preferences and location.'
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Personalized feed' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forum_query_dto_1.ForumQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)('moderation/queue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get moderation queue',
        description: 'Get posts flagged for moderation (admin/moderator only).'
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Moderation queue' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getModerationQueue", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get forum post by ID',
        description: 'Get detailed view of a forum post with comments and reactions.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Forum post ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Forum post details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update forum post',
        description: 'Update a forum post (owner, admin, or moderator only).'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Forum post ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Forum post updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_forum_post_dto_1.UpdateForumPostDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete forum post',
        description: 'Delete a forum post (owner, admin, or moderator only).'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Forum post ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Forum post deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Add comment to post',
        description: 'Add a comment to a forum post.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Forum post ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Comment added' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get post comments',
        description: 'Get paginated comments for a forum post.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Forum post ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Comments limit' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Comments offset' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Post comments' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(':id/react'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'React to post',
        description: 'Add or remove emoji reaction to a forum post (toggle behavior).'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Forum post ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Reaction toggled' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reaction_dto_1.CreateReactionDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Patch)(':id/moderate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Moderate post',
        description: 'Approve, hide, or remove a forum post (admin/moderator only).'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Forum post ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Post moderated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "moderatePost", null);
exports.ForumController = ForumController = __decorate([
    (0, swagger_1.ApiTags)('forums'),
    (0, common_1.Controller)('forums'),
    __metadata("design:paramtypes", [forum_service_1.ForumService])
], ForumController);
//# sourceMappingURL=forum.controller.js.map