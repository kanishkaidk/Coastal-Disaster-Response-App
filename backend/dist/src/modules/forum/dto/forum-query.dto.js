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
exports.ForumQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ForumQueryDto {
    lat;
    lng;
    radius = 10000;
    type;
    status;
    minUrgency;
    minTrust;
    language;
    search;
    author;
    sortBy = 'createdAt';
    sortOrder = 'desc';
    limit = 20;
    offset = 0;
    cursor;
}
exports.ForumQueryDto = ForumQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Latitude for geo radius search',
        example: 13.0827
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ForumQueryDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Longitude for geo radius search',
        example: 80.2707
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ForumQueryDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Radius in meters',
        example: 5000,
        default: 10000
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], ForumQueryDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['help', 'info', 'offer'],
        description: 'Filter by post type'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['help', 'info', 'offer']),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['active', 'under_review', 'removed'],
        description: 'Filter by status'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'under_review', 'removed']),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Minimum urgency score',
        example: 50,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ForumQueryDto.prototype, "minUrgency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Minimum trust score',
        example: 70,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ForumQueryDto.prototype, "minTrust", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Language filter',
        example: 'en'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Search query',
        example: 'flood help'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Author user ID',
        example: 'user123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['createdAt', 'trustScore', 'urgencyScore', 'proximity'],
        description: 'Sort field',
        default: 'createdAt'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['createdAt', 'trustScore', 'urgencyScore', 'proximity']),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order',
        default: 'desc'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "sortOrder", void 0);
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
], ForumQueryDto.prototype, "limit", void 0);
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
], ForumQueryDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Cursor for pagination',
        example: 'eyJjcmVhdGVkQXQiOiIyMDI0LTAxLTE3VDEwOjAwOjAwLjAwMFoifQ=='
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForumQueryDto.prototype, "cursor", void 0);
//# sourceMappingURL=forum-query.dto.js.map