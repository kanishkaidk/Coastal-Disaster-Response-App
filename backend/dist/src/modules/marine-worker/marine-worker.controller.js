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
exports.MarineWorkerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const marine_worker_service_1 = require("./marine-worker.service");
const create_marine_worker_dto_1 = require("./dto/create-marine-worker.dto");
const update_work_details_dto_1 = require("./dto/update-work-details.dto");
const create_warning_dto_1 = require("./dto/create-warning.dto");
let MarineWorkerController = class MarineWorkerController {
    marineWorkerService;
    constructor(marineWorkerService) {
        this.marineWorkerService = marineWorkerService;
    }
    async verifyMarineWorker(req, createMarineWorkerDto) {
        const userId = req.user.id;
        return this.marineWorkerService.createMarineWorker(userId, createMarineWorkerDto);
    }
    async getProfile(req) {
        const userId = req.user.id;
        return this.marineWorkerService.getMarineWorker(userId);
    }
    async updateWorkDetails(req, updateWorkDetailsDto) {
        const userId = req.user.id;
        return this.marineWorkerService.updateWorkDetails(userId, updateWorkDetailsDto);
    }
    async createWarning(req, createWarningDto) {
        const userId = req.user.id;
        return this.marineWorkerService.createWarning(userId, createWarningDto);
    }
    async getWarnings(req) {
        const userId = req.user.id;
        return this.marineWorkerService.getWarnings(userId);
    }
    async getAllMarineWorkers() {
        return this.marineWorkerService.getAllMarineWorkers();
    }
};
exports.MarineWorkerController = MarineWorkerController;
__decorate([
    (0, common_1.Post)('verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify and create marine worker profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Marine worker profile created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Marine worker profile already exists' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_marine_worker_dto_1.CreateMarineWorkerDto]),
    __metadata("design:returntype", Promise)
], MarineWorkerController.prototype, "verifyMarineWorker", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get marine worker profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marine worker profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Marine worker profile not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarineWorkerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('work-details'),
    (0, swagger_1.ApiOperation)({ summary: 'Update work details for today' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Work details updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Marine worker profile not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_work_details_dto_1.UpdateWorkDetailsDto]),
    __metadata("design:returntype", Promise)
], MarineWorkerController.prototype, "updateWorkDetails", null);
__decorate([
    (0, common_1.Post)('warning'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a warning report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Warning created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Marine worker profile not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_warning_dto_1.CreateWarningDto]),
    __metadata("design:returntype", Promise)
], MarineWorkerController.prototype, "createWarning", null);
__decorate([
    (0, common_1.Get)('warnings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all warnings by marine worker' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Warnings retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Marine worker profile not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarineWorkerController.prototype, "getWarnings", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all marine workers (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All marine workers retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarineWorkerController.prototype, "getAllMarineWorkers", null);
exports.MarineWorkerController = MarineWorkerController = __decorate([
    (0, swagger_1.ApiTags)('marine-worker'),
    (0, common_1.Controller)('marine-worker'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [marine_worker_service_1.MarineWorkerService])
], MarineWorkerController);
//# sourceMappingURL=marine-worker.controller.js.map