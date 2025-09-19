import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarineWorkerDto } from './dto/create-marine-worker.dto';
import { UpdateWorkDetailsDto } from './dto/update-work-details.dto';
import { CreateWarningDto } from './dto/create-warning.dto';

@Injectable()
export class MarineWorkerService {
  constructor(private prisma: PrismaService) {}

  async createMarineWorker(userId: string, createMarineWorkerDto: CreateMarineWorkerDto) {
    // Check if user already has a marine worker profile
    const existingMarineWorker = await this.prisma.marineWorker.findUnique({
      where: { userId },
    });

    if (existingMarineWorker) {
      throw new ConflictException('Marine worker profile already exists for this user');
    }

    // Update user role to marine_worker
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'marine_worker' },
    });

    // Create marine worker profile
    const marineWorker = await this.prisma.marineWorker.create({
      data: {
        userId,
        name: createMarineWorkerDto.name,
        phone: createMarineWorkerDto.phone,
        isVerified: true,
      },
      include: {
        user: true,
      },
    });

    return marineWorker;
  }

  async getMarineWorker(userId: string) {
    const marineWorker = await this.prisma.marineWorker.findUnique({
      where: { userId },
      include: {
        user: true,
        warnings: true,
      },
    });

    if (!marineWorker) {
      throw new NotFoundException('Marine worker profile not found');
    }

    return marineWorker;
  }

  async updateWorkDetails(userId: string, updateWorkDetailsDto: UpdateWorkDetailsDto) {
    const marineWorker = await this.getMarineWorker(userId);

    const updatedMarineWorker = await this.prisma.marineWorker.update({
      where: { id: marineWorker.id },
      data: {
        workToday: updateWorkDetailsDto.workToday,
        observations: updateWorkDetailsDto.observations,
      },
      include: {
        user: true,
      },
    });

    return updatedMarineWorker;
  }

  async createWarning(userId: string, createWarningDto: CreateWarningDto) {
    const marineWorker = await this.getMarineWorker(userId);

    const warning = await this.prisma.marineWorkerWarning.create({
      data: {
        marineWorkerId: marineWorker.id,
        description: createWarningDto.description,
        severity: createWarningDto.severity || 1,
      },
    });

    return warning;
  }

  async getWarnings(userId: string) {
    const marineWorker = await this.getMarineWorker(userId);

    const warnings = await this.prisma.marineWorkerWarning.findMany({
      where: { marineWorkerId: marineWorker.id },
      orderBy: { createdAt: 'desc' },
    });

    return warnings;
  }

  async getAllMarineWorkers() {
    return this.prisma.marineWorker.findMany({
      include: {
        user: true,
        warnings: true,
      },
    });
  }
}
