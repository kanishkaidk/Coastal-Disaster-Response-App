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
exports.CreateWarningDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateWarningDto {
    type;
    message;
    severity;
    area; // GeoJSON Polygon
    validFrom;
    validTo;
    instructions;
    source;
}
exports.CreateWarningDto = CreateWarningDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other'],
        description: 'Warning type',
        example: 'flood'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['flood', 'cyclone', 'tsunami', 'storm', 'pollution', 'accident', 'other']),
    __metadata("design:type", String)
], CreateWarningDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Warning message',
        example: 'Heavy rainfall expected in Chennai coastal areas. Avoid low-lying areas.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWarningDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity level (1-5)',
        example: 4,
        minimum: 1,
        maximum: 5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateWarningDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Warning area as GeoJSON polygon',
        example: {
            type: 'Polygon',
            coordinates: [[[80.1, 13.0], [80.2, 13.0], [80.2, 13.1], [80.1, 13.1], [80.1, 13.0]]]
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWarningDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Warning valid from',
        example: '2024-01-17T10:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWarningDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Warning valid until',
        example: '2024-01-18T10:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWarningDto.prototype, "validTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Additional instructions or actions',
        example: 'Evacuate immediately. Contact emergency services at 108.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWarningDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Source organization',
        example: 'IMD Chennai'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWarningDto.prototype, "source", void 0);
//# sourceMappingURL=create-warning.dto.js.map