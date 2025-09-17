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
exports.WarningQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class WarningQueryDto {
    type;
    minSeverity;
    lat;
    lng;
    radius = 50000;
    status;
    search;
    limit = 20;
    offset = 0;
}
exports.WarningQueryDto = WarningQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'],
        description: 'Filter by warning type'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other']),
    __metadata("design:type", String)
], WarningQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Minimum severity level',
        example: 3,
        minimum: 1,
        maximum: 5
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], WarningQueryDto.prototype, "minSeverity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Latitude for geo search',
        example: 13.0827
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WarningQueryDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Longitude for geo search',
        example: 80.2707
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WarningQueryDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Search radius in meters',
        example: 10000,
        default: 50000
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(200000),
    __metadata("design:type", Number)
], WarningQueryDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by status',
        enum: ['active', 'expired', 'cancelled']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'expired', 'cancelled']),
    __metadata("design:type", String)
], WarningQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Search in message content',
        example: 'flood'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WarningQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Page limit',
        example: 20,
        default: 20,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], WarningQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Page offset',
        example: 0,
        default: 0,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], WarningQueryDto.prototype, "offset", void 0);
//# sourceMappingURL=warning-query.dto.js.map