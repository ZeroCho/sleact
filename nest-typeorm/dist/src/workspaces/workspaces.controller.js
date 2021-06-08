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
exports.WorkspacesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logged_in_guard_1 = require("../auth/logged-in.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const Users_1 = require("../entities/Users");
const create_workspace_dto_1 = require("./dto/create-workspace.dto");
const workspaces_service_1 = require("./workspaces.service");
let WorkspacesController = class WorkspacesController {
    constructor(workspacesService) {
        this.workspacesService = workspacesService;
    }
    async getMyWorkspaces(user) {
        return this.workspacesService.findMyWorkspaces(user.id);
    }
    async createWorkspace(user, body) {
        return this.workspacesService.createWorkspace(body.workspace, body.url, user.id);
    }
    async getWorkspaceMembers(url) {
        return this.workspacesService.getWorkspaceMembers(url);
    }
    async createWorkspaceMembers(url, email) {
        return this.workspacesService.createWorkspaceMembers(url, email);
    }
    async getWorkspaceMember(url, id) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }
    async getWorkspaceUser(url, id) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: '내 워크스페이스 가져오기' }),
    common_1.Get(),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getMyWorkspaces", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 만들기' }),
    common_1.Post(),
    __param(0, user_decorator_1.User()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users, create_workspace_dto_1.CreateWorkspaceDto]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "createWorkspace", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 멤버 가져오기' }),
    common_1.Get(':url/members'),
    __param(0, common_1.Param('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 멤버 초대하기' }),
    common_1.Post(':url/members'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "createWorkspaceMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' }),
    common_1.Get(':url/members/:id'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceMember", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' }),
    common_1.Get(':url/users/:id'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceUser", null);
WorkspacesController = __decorate([
    swagger_1.ApiTags('WORKSPACES'),
    swagger_1.ApiCookieAuth('connect.sid'),
    common_1.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_1.Controller('api/workspaces'),
    __metadata("design:paramtypes", [workspaces_service_1.WorkspacesService])
], WorkspacesController);
exports.WorkspacesController = WorkspacesController;
//# sourceMappingURL=workspaces.controller.js.map