import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MarineWorkerService } from './marine-worker.service';
import { CreateMarineWorkerDto } from './dto/create-marine-worker.dto';
import { UpdateWorkDetailsDto } from './dto/update-work-details.dto';
import { CreateWarningDto } from './dto/create-warning.dto';

@ApiTags('marine-worker')
@Controller('marine-worker')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarineWorkerController {
  constructor(private readonly marineWorkerService: MarineWorkerService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Verify and create marine worker profile' })
  @ApiResponse({ status: 201, description: 'Marine worker profile created successfully' })
  @ApiResponse({ status: 409, description: 'Marine worker profile already exists' })
  async verifyMarineWorker(@Request() req: ExpressRequest & { user: { id: string } }, @Body() createMarineWorkerDto: CreateMarineWorkerDto) {
    const userId = req.user.id;
    return this.marineWorkerService.createMarineWorker(userId, createMarineWorkerDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get marine worker profile' })
  @ApiResponse({ status: 200, description: 'Marine worker profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Marine worker profile not found' })
  async getProfile(@Request() req: ExpressRequest & { user: { id: string } }) {
    const userId = req.user.id;
    return this.marineWorkerService.getMarineWorker(userId);
  }

  @Put('work-details')
  @ApiOperation({ summary: 'Update work details for today' })
  @ApiResponse({ status: 200, description: 'Work details updated successfully' })
  @ApiResponse({ status: 404, description: 'Marine worker profile not found' })
  async updateWorkDetails(@Request() req: ExpressRequest & { user: { id: string } }, @Body() updateWorkDetailsDto: UpdateWorkDetailsDto) {
    const userId = req.user.id;
    return this.marineWorkerService.updateWorkDetails(userId, updateWorkDetailsDto);
  }

  @Post('warning')
  @ApiOperation({ summary: 'Create a warning report' })
  @ApiResponse({ status: 201, description: 'Warning created successfully' })
  @ApiResponse({ status: 404, description: 'Marine worker profile not found' })
  async createWarning(@Request() req: ExpressRequest & { user: { id: string } }, @Body() createWarningDto: CreateWarningDto) {
    const userId = req.user.id;
    return this.marineWorkerService.createWarning(userId, createWarningDto);
  }

  @Get('warnings')
  @ApiOperation({ summary: 'Get all warnings by marine worker' })
  @ApiResponse({ status: 200, description: 'Warnings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Marine worker profile not found' })
  async getWarnings(@Request() req: ExpressRequest & { user: { id: string } }) {
    const userId = req.user.id;
    return this.marineWorkerService.getWarnings(userId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all marine workers (admin only)' })
  @ApiResponse({ status: 200, description: 'All marine workers retrieved successfully' })
  async getAllMarineWorkers() {
    return this.marineWorkerService.getAllMarineWorkers();
  }
}
