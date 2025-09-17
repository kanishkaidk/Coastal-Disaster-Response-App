import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reports: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create hazard report' })
  @ApiOkResponse({ description: 'Report created (queued for processing)' })
  async create(@Req() req: any, @Body() dto: CreateReportDto) {
    const userId = req.user?.userId;
    const result = await this.reports.create(userId, dto);
    return { app: 'Coast-Kavach', result };
  }

  @Get('nearby')
  @ApiOperation({ summary: 'List nearby reports' })
  async nearby(@Query('lat') lat: string, @Query('lng') lng: string) {
    const res = await this.reports.listNearby(Number(lat), Number(lng));
    return { app: 'Coast-Kavach', data: res };
  }
}


