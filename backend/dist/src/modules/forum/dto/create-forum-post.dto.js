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
exports.CreateForumPostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateForumPostDto {
    type;
    content;
    mediaUrl;
    location;
    urgencyScore;
    language;
}
exports.CreateForumPostDto = CreateForumPostDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['help', 'info', 'offer'],
        description: 'Type of forum post',
        example: 'help'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['help', 'info', 'offer']),
    __metadata("design:type", String)
], CreateForumPostDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Post content',
        example: 'Need help with food and water in Chennai area'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateForumPostDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Media URL (image/video)',
        example: 'https://s3.amazonaws.com/bucket/image.jpg'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateForumPostDto.prototype, "mediaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location coordinates',
        example: { lat: 13.0827, lng: 80.2707 }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateForumPostDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Urgency score (0-100)',
        example: 85,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateForumPostDto.prototype, "urgencyScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Language code',
        example: 'en',
        default: 'en'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateForumPostDto.prototype, "language", void 0);
//# sourceMappingURL=create-forum-post.dto.js.map