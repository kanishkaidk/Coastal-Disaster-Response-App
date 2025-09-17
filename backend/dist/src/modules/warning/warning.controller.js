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
exports.WarningController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const warning_service_1 = require("./warning.service");
const create_warning_dto_1 = require("./dto/create-warning.dto");
const warning_query_dto_1 = require("./dto/warning-query.dto");
let WarningController = class WarningController {
    warningService;
    constructor(warningService) {
        this.warningService = warningService;
    }
    async create(req, dto) {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const data = await this.warningService.create(userId, userRole, dto);
        return { app: 'Coast-Kavach', data };
    }
    async findAll(query) {
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
    async getNearby(lat, lng, radius) {
        const data = await this.warningService.getNearby(parseFloat(lat), parseFloat(lng), radius ? parseInt(radius) : 50000);
        return { app: 'Coast-Kavach', data };
    }
    async getStats() {
        const data = await this.warningService.getStats();
        return { app: 'Coast-Kavach', data };
    }
    async findOne(id) {
        const data = await this.warningService.findOne(id);
        return { app: 'Coast-Kavach', data };
    }
    async update(id, dto, req) {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const data = await this.warningService.update(id, userId, userRole, dto);
        return { app: 'Coast-Kavach', data };
    }
    async remove(id, req) {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const data = await this.warningService.remove(id, userId, userRole);
        return { app: 'Coast-Kavach', data };
    }
};
exports.WarningController = WarningController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('marine_worker', 'analyst', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Issue a warning',
        description: 'Issue a new warning with area polygon and severity level (marine worker, analyst, admin only)'
    }),
    (0, swagger_1.ApiOkResponse)({
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
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_warning_dto_1.CreateWarningDto]),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List warnings',
        description: 'Get paginated list of warnings with filtering and geo search. No authentication required for viewing.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'] }),
    (0, swagger_1.ApiQuery)({ name: 'minSeverity', required: false, description: 'Minimum severity level' }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false, description: 'Latitude for geo search' }),
    (0, swagger_1.ApiQuery)({ name: 'lng', required: false, description: 'Longitude for geo search' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, description: 'Search radius in meters' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['active', 'expired', 'cancelled'] }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search in message content' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Page limit' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Page offset' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of warnings' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [warning_query_dto_1.WarningQueryDto]),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get nearby warnings',
        description: 'Get active warnings within specified radius of a location'
    }),
    (0, swagger_1.ApiQuery)({ name: 'lat', description: 'Latitude' }),
    (0, swagger_1.ApiQuery)({ name: 'lng', description: 'Longitude' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, description: 'Radius in meters', default: 50000 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Nearby warnings' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "getNearby", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'moderator', 'analyst'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get warning statistics',
        description: 'Get warning statistics and analytics (admin/moderator/analyst only)'
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Warning statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get warning by ID',
        description: 'Get detailed warning information'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Warning ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Warning details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('marine_worker', 'analyst', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update warning',
        description: 'Update warning information (issuer, admin, or marine worker only)'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Warning ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Warning updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'marine_worker'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete warning',
        description: 'Delete a warning (issuer or admin only)'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Warning ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Warning deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "remove", null);
exports.WarningController = WarningController = __decorate([
    (0, swagger_1.ApiTags)('warnings'),
    (0, common_1.Controller)('warnings'),
    __metadata("design:paramtypes", [warning_service_1.WarningService])
], WarningController);
//# sourceMappingURL=warning.controller.js.map