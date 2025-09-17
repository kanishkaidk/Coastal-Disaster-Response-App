import { 
  Controller, 
  Get, 
  Post, 
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
import { SosService } from './sos.service';
import { CreateSosDto } from './dto/create-sos.dto';

@ApiTags('sos')
@Controller('sos')
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Send SOS alert',
    description: 'Send emergency SOS alert with automatic fallback through multiple delivery methods (Internet -> Mesh -> SMS -> Call)'
  })
  @ApiOkResponse({ 
    description: 'SOS alert sent',
    schema: {
      type: 'object',
      properties: {
        app: { type: 'string', example: 'Coast-Kavach' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            message: { type: 'string' },
            location: { type: 'object' },
            delivered: { type: 'boolean' },
            channel: { type: 'string', enum: ['internet', 'mesh', 'sms', 'call', 'failed'] },
            createdAt: { type: 'string', format: 'date-time' },
            deliveryStatus: {
              type: 'object',
              properties: {
                delivered: { type: 'boolean' },
                channel: { type: 'string' },
                attempts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      method: { type: 'string' },
                      success: { type: 'boolean' },
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async create(@Req() req: any, @Body() dto: CreateSosDto) {
    const userId = req.user?.userId;
    const data = await this.sosService.create(userId, dto);
    return { app: 'Coast-Kavach', data };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator', 'marine_worker')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'List SOS alerts',
    description: 'Get list of SOS alerts (admin/moderator/marine worker only)'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
  @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
  @ApiOkResponse({ description: 'List of SOS alerts' })
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Req() req?: any
  ) {
    const userId = req?.user?.role === 'citizen' ? req.user?.userId : undefined;
    const data = await this.sosService.findAll(
      userId, 
      limit ? parseInt(limit) : 20, 
      offset ? parseInt(offset) : 0
    );
    return { app: 'Coast-Kavach', data };
  }

  @Get('nearby')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator', 'marine_worker')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get nearby SOS alerts',
    description: 'Get SOS alerts within specified radius (admin/moderator/marine worker only)'
  })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radius in meters', default: 5000 })
  @ApiOkResponse({ description: 'Nearby SOS alerts' })
  async getNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string
  ) {
    const data = await this.sosService.getNearby(
      parseFloat(lat), 
      parseFloat(lng), 
      radius ? parseInt(radius) : 5000
    );
    return { app: 'Coast-Kavach', data };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get SOS statistics',
    description: 'Get SOS delivery statistics and metrics (admin/moderator only)'
  })
  @ApiOkResponse({ description: 'SOS statistics' })
  async getStats() {
    const data = await this.sosService.getStats();
    return { app: 'Coast-Kavach', data };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get SOS by ID',
    description: 'Get detailed SOS alert information'
  })
  @ApiParam({ name: 'id', description: 'SOS ID' })
  @ApiOkResponse({ description: 'SOS details' })
  async findOne(@Param('id') id: string) {
    const data = await this.sosService.findOne(id);
    return { app: 'Coast-Kavach', data };
  }
}
