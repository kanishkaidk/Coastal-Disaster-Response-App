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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarineWorkerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MarineWorkerService = class MarineWorkerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMarineWorker(userId, createMarineWorkerDto) {
        // Check if user already has a marine worker profile
        const existingMarineWorker = await this.prisma.marineWorker.findUnique({
            where: { userId },
        });
        if (existingMarineWorker) {
            throw new common_1.ConflictException('Marine worker profile already exists for this user');
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
    async getMarineWorker(userId) {
        const marineWorker = await this.prisma.marineWorker.findUnique({
            where: { userId },
            include: {
                user: true,
                warnings: true,
            },
        });
        if (!marineWorker) {
            throw new common_1.NotFoundException('Marine worker profile not found');
        }
        return marineWorker;
    }
    async updateWorkDetails(userId, updateWorkDetailsDto) {
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
    async createWarning(userId, createWarningDto) {
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
    async getWarnings(userId) {
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
};
exports.MarineWorkerService = MarineWorkerService;
exports.MarineWorkerService = MarineWorkerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarineWorkerService);
//# sourceMappingURL=marine-worker.service.js.map