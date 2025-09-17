"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateForumPostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_forum_post_dto_1 = require("./create-forum-post.dto");
class UpdateForumPostDto extends (0, swagger_1.PartialType)(create_forum_post_dto_1.CreateForumPostDto) {
}
exports.UpdateForumPostDto = UpdateForumPostDto;
//# sourceMappingURL=update-forum-post.dto.js.map