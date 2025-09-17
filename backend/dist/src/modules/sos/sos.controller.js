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
exports.SosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const sos_service_1 = require("./sos.service");
const create_sos_dto_1 = require("./dto/create-sos.dto");
let SosController = class SosController {
    sosService;
    constructor(sosService) {
        this.sosService = sosService;
    }
    async create(req, dto) {
        const userId = req.user?.userId;
        const data = await this.sosService.create(userId, dto);
        return { app: 'Coast-Kavach', data };
    }
    async findAll(limit, offset, req) {
        const userId = req?.user?.role === 'citizen' ? req.user?.userId : undefined;
        const data = await this.sosService.findAll(userId, limit ? parseInt(limit) : 20, offset ? parseInt(offset) : 0);
        return { app: 'Coast-Kavach', data };
    }
    async getNearby(lat, lng, radius) {
        const data = await this.sosService.getNearby(parseFloat(lat), parseFloat(lng), radius ? parseInt(radius) : 5000);
        return { app: 'Coast-Kavach', data };
    }
    async getStats() {
        const data = await this.sosService.getStats();
        return { app: 'Coast-Kavach', data };
    }
    async findOne(id) {
        const data = await this.sosService.findOne(id);
        return { app: 'Coast-Kavach', data };
    }
};
exports.SosController = SosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Send SOS alert',
        description: 'Send emergency SOS alert with automatic fallback through multiple delivery methods (Internet -> Mesh -> SMS -> Call)'
    }),
    (0, swagger_1.ApiOkResponse)({
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
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sos_dto_1.CreateSosDto]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'moderator', 'marine_worker'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List SOS alerts',
        description: 'Get list of SOS alerts (admin/moderator/marine worker only)'
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Page limit' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Page offset' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of SOS alerts' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'moderator', 'marine_worker'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get nearby SOS alerts',
        description: 'Get SOS alerts within specified radius (admin/moderator/marine worker only)'
    }),
    (0, swagger_1.ApiQuery)({ name: 'lat', description: 'Latitude' }),
    (0, swagger_1.ApiQuery)({ name: 'lng', description: 'Longitude' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, description: 'Radius in meters', default: 5000 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Nearby SOS alerts' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "getNearby", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get SOS statistics',
        description: 'Get SOS delivery statistics and metrics (admin/moderator only)'
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'SOS statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SosController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get SOS by ID',
        description: 'Get detailed SOS alert information'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'SOS ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'SOS details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "findOne", null);
exports.SosController = SosController = __decorate([
    (0, swagger_1.ApiTags)('sos'),
    (0, common_1.Controller)('sos'),
    __metadata("design:paramtypes", [sos_service_1.SosService])
], SosController);
//# sourceMappingURL=sos.controller.js.map