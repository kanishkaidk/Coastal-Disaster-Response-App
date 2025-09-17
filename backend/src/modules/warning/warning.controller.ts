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
import { WarningService } from './warning.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { WarningQueryDto } from './dto/warning-query.dto';

@ApiTags('warnings')
@Controller('warnings')
export class WarningController {
  constructor(private readonly warningService: WarningService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('marine_worker', 'analyst', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Issue a warning',
    description: 'Issue a new warning with area polygon and severity level (marine worker, analyst, admin only)'
  })
  @ApiOkResponse({ 
    description: 'Warning issued successfully',
    schema: {
      type: 'object',
      properties: {
        app: { type: 'string', example: 'Coast-Kavach' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'] },
            message: { type: 'string' },
            severity: { type: 'number', minimum: 1, maximum: 5 },
            area: { type: 'object', description: 'GeoJSON Polygon' },
            validFrom: { type: 'string', format: 'date-time' },
            validTo: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['scheduled', 'active', 'expired'] },
            translations: { type: 'object' },
            issuer: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async create(@Req() req: any, @Body() dto: CreateWarningDto) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const data = await this.warningService.create(userId, userRole, dto);
    return { app: 'Coast-Kavach', data };
  }

  @Get()
  @ApiOperation({ 
    summary: 'List warnings',
    description: 'Get paginated list of warnings with filtering and geo search. No authentication required for viewing.'
  })
  @ApiQuery({ name: 'type', required: false, enum: ['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'] })
  @ApiQuery({ name: 'minSeverity', required: false, description: 'Minimum severity level' })
  @ApiQuery({ name: 'lat', required: false, description: 'Latitude for geo search' })
  @ApiQuery({ name: 'lng', required: false, description: 'Longitude for geo search' })
  @ApiQuery({ name: 'radius', required: false, description: 'Search radius in meters' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'expired', 'cancelled'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search in message content' })
  @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
  @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
  @ApiOkResponse({ description: 'List of warnings' })
  async findAll(@Query() query: WarningQueryDto) {
    const data = await this.warningService.findAll(query);
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

  @Get('nearby')
  @ApiOperation({ 
    summary: 'Get nearby warnings',
    description: 'Get active warnings within specified radius of a location'
  })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radius in meters', default: 50000 })
  @ApiOkResponse({ description: 'Nearby warnings' })
  async getNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string
  ) {
    const data = await this.warningService.getNearby(
      parseFloat(lat), 
      parseFloat(lng), 
      radius ? parseInt(radius) : 50000
    );
    return { app: 'Coast-Kavach', data };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator', 'analyst')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get warning statistics',
    description: 'Get warning statistics and analytics (admin/moderator/analyst only)'
  })
  @ApiOkResponse({ description: 'Warning statistics' })
  async getStats() {
    const data = await this.warningService.getStats();
    return { app: 'Coast-Kavach', data };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get warning by ID',
    description: 'Get detailed warning information'
  })
  @ApiParam({ name: 'id', description: 'Warning ID' })
  @ApiOkResponse({ description: 'Warning details' })
  async findOne(@Param('id') id: string) {
    const data = await this.warningService.findOne(id);
    return { app: 'Coast-Kavach', data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('marine_worker', 'analyst', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update warning',
    description: 'Update warning information (issuer, admin, or marine worker only)'
  })
  @ApiParam({ name: 'id', description: 'Warning ID' })
  @ApiOkResponse({ description: 'Warning updated' })
  async update(
    @Param('id') id: string, 
    @Body() dto: Partial<CreateWarningDto>, 
    @Req() req: any
  ) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const data = await this.warningService.update(id, userId, userRole, dto);
    return { app: 'Coast-Kavach', data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'marine_worker')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete warning',
    description: 'Delete a warning (issuer or admin only)'
  })
  @ApiParam({ name: 'id', description: 'Warning ID' })
  @ApiOkResponse({ description: 'Warning deleted' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const data = await this.warningService.remove(id, userId, userRole);
    return { app: 'Coast-Kavach', data };
  }
}
