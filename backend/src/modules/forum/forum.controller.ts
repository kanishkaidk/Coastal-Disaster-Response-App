import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put, 
  Query, 
  Req, 
  UseGuards,
  Patch
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiOkResponse, 
  ApiOperation, 
  ApiTags,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ForumService } from './forum.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { ForumQueryDto } from './dto/forum-query.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';

@ApiTags('forums')
@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new forum post',
    description: 'Create a new forum post with optional media and location. AI processing is queued automatically.'
  })
  @ApiOkResponse({ 
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
  })
  async create(@Req() req: any, @Body() dto: CreateForumPostDto) {
    const userId = req.user?.userId;
    const data = await this.forumService.create(userId, dto);
    return { app: 'Coast-Kavach', data };
  }

  @Get()
  @ApiOperation({ 
    summary: 'List forum posts',
    description: 'Get paginated list of forum posts with filtering, sorting, and geo-radius search. No authentication required for viewing.'
  })
  @ApiQuery({ name: 'lat', required: false, description: 'Latitude for geo search' })
  @ApiQuery({ name: 'lng', required: false, description: 'Longitude for geo search' })
  @ApiQuery({ name: 'radius', required: false, description: 'Search radius in meters' })
  @ApiQuery({ name: 'type', required: false, enum: ['help', 'info', 'offer'] })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'under_review', 'removed'] })
  @ApiQuery({ name: 'minUrgency', required: false, description: 'Minimum urgency score' })
  @ApiQuery({ name: 'minTrust', required: false, description: 'Minimum trust score' })
  @ApiQuery({ name: 'language', required: false, description: 'Language filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({ name: 'author', required: false, description: 'Author user ID' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'trustScore', 'urgencyScore', 'proximity'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
  @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Pagination cursor' })
  @ApiOkResponse({ 
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
  })
  async findAll(@Query() query: ForumQueryDto, @Req() req?: any) {
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

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get personalized feed',
    description: 'Get AI-ranked personalized feed of forum posts based on user preferences and location.'
  })
  @ApiOkResponse({ description: 'Personalized feed' })
  async getFeed(@Query() query: ForumQueryDto, @Req() req: any) {
    const userId = req.user?.userId;
    const data = await this.forumService.getFeed(userId, query);
    return { app: 'Coast-Kavach', data };
  }

  @Get('moderation/queue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get moderation queue',
    description: 'Get posts flagged for moderation (admin/moderator only).'
  })
  @ApiOkResponse({ description: 'Moderation queue' })
  async getModerationQueue(@Req() req: any) {
    const userRole = req.user?.role;
    const data = await this.forumService.getModerationQueue(userRole);
    return { app: 'Coast-Kavach', data };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get forum post by ID',
    description: 'Get detailed view of a forum post with comments and reactions.'
  })
  @ApiParam({ name: 'id', description: 'Forum post ID' })
  @ApiOkResponse({ description: 'Forum post details' })
  async findOne(@Param('id') id: string) {
    const data = await this.forumService.findOne(id);
    return { app: 'Coast-Kavach', data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update forum post',
    description: 'Update a forum post (owner, admin, or moderator only).'
  })
  @ApiParam({ name: 'id', description: 'Forum post ID' })
  @ApiOkResponse({ description: 'Forum post updated' })
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateForumPostDto, 
    @Req() req: any
  ) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const data = await this.forumService.update(id, userId, dto, userRole);
    return { app: 'Coast-Kavach', data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete forum post',
    description: 'Delete a forum post (owner, admin, or moderator only).'
  })
  @ApiParam({ name: 'id', description: 'Forum post ID' })
  @ApiOkResponse({ description: 'Forum post deleted' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const data = await this.forumService.remove(id, userId, userRole);
    return { app: 'Coast-Kavach', data };
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Add comment to post',
    description: 'Add a comment to a forum post.'
  })
  @ApiParam({ name: 'id', description: 'Forum post ID' })
  @ApiOkResponse({ description: 'Comment added' })
  async addComment(
    @Param('id') postId: string, 
    @Body() dto: CreateCommentDto, 
    @Req() req: any
  ) {
    const userId = req.user?.userId;
    const data = await this.forumService.addComment(postId, userId, dto);
    return { app: 'Coast-Kavach', data };
  }

  @Get(':id/comments')
  @ApiOperation({ 
    summary: 'Get post comments',
    description: 'Get paginated comments for a forum post.'
  })
  @ApiParam({ name: 'id', description: 'Forum post ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Comments limit' })
  @ApiQuery({ name: 'offset', required: false, description: 'Comments offset' })
  @ApiOkResponse({ description: 'Post comments' })
  async getComments(
    @Param('id') postId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const data = await this.forumService.getComments(
      postId, 
      limit ? parseInt(limit) : 20, 
      offset ? parseInt(offset) : 0
    );
    return { app: 'Coast-Kavach', data };
  }

  @Post(':id/react')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'React to post',
    description: 'Add or remove emoji reaction to a forum post (toggle behavior).'
  })
  @ApiParam({ name: 'id', description: 'Forum post ID' })
  @ApiOkResponse({ description: 'Reaction toggled' })
  async addReaction(
    @Param('id') postId: string, 
    @Body() dto: CreateReactionDto, 
    @Req() req: any
  ) {
    const userId = req.user?.userId;
    const data = await this.forumService.addReaction(postId, userId, dto);
    return { app: 'Coast-Kavach', data };
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Moderate post',
    description: 'Approve, hide, or remove a forum post (admin/moderator only).'
  })
  @ApiParam({ name: 'id', description: 'Forum post ID' })
  @ApiOkResponse({ description: 'Post moderated' })
  async moderatePost(
    @Param('id') id: string,
    @Body() body: { action: 'approve' | 'hide' | 'remove'; reason?: string },
    @Req() req: any
  ) {
    const userRole = req.user?.role;
    const data = await this.forumService.moderatePost(id, body.action, userRole, body.reason);
    return { app: 'Coast-Kavach', data };
  }
}
