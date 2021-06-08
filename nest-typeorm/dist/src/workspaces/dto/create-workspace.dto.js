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
exports.CreateWorkspaceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateWorkspaceDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: '슬리액트',
        description: '워크스페이스명',
    }),
    __metadata("design:type", String)
], CreateWorkspaceDto.prototype, "workspace", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 'sleact',
        description: 'url 주소',
    }),
    __metadata("design:type", String)
], CreateWorkspaceDto.prototype, "url", void 0);
exports.CreateWorkspaceDto = CreateWorkspaceDto;
//# sourceMappingURL=create-workspace.dto.js.map