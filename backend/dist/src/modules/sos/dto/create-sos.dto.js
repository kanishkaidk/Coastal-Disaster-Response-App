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
exports.CreateSosDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSosDto {
    message;
    location;
    mediaUrl;
}
exports.CreateSosDto = CreateSosDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'SOS message',
        example: 'Help! I am trapped in flood waters near Marina Beach'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSosDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location coordinates',
        example: { lat: 13.0827, lng: 80.2707 }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSosDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Media URL (photo/video)',
        example: 'https://s3.amazonaws.com/bucket/sos-photo.jpg'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSosDto.prototype, "mediaUrl", void 0);
//# sourceMappingURL=create-sos.dto.js.map