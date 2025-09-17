import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { 
  ApiOkResponse, 
  ApiOperation, 
  ApiTags, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Create a new user (admin only)'
  })
  @ApiOkResponse({ description: 'User created successfully' })
  async create(@Body() dto: CreateUserDto) {
    const data = await this.users.create(dto);
    return { app: 'Coast-Kavach', data };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'List users',
    description: 'Get paginated list of users with filtering (admin/moderator only)'
  })
  @ApiQuery({ name: 'role', required: false, enum: ['citizen', 'marine_worker', 'analyst', 'moderator', 'admin'] })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiOkResponse({ description: 'List of users' })
  async findAll(@Query() query: UserQueryDto) {
    const data = await this.users.findAll(query);
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Get detailed user information including activity stats'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User details' })
  async getOne(@Param('id') id: string) {
    const data = await this.users.getById(id);
    return { app: 'Coast-Kavach', data };
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user statistics',
    description: 'Get user activity statistics and counts'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User statistics' })
  async getStats(@Param('id') id: string) {
    const data = await this.users.getStats(id);
    return { app: 'Coast-Kavach', data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update user information (self or admin/moderator)'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User updated' })
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateUserDto, 
    @Req() req: any
  ) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const data = await this.users.update(id, dto, userId, userRole);
    return { app: 'Coast-Kavach', data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Delete a user (admin only)'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User deleted' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const data = await this.users.remove(id, userId, userRole);
    return { app: 'Coast-Kavach', data };
  }
}


