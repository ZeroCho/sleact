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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const logged_in_guard_1 = require("../auth/logged-in.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const Users_1 = require("../entities/Users");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const channels_service_1 = require("./channels.service");
try {
    fs_1.default.readdirSync('uploads');
}
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs_1.default.mkdirSync('uploads');
}
let ChannelsController = class ChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    async getWorkspaceChannels(url, user) {
        return this.channelsService.getWorkspaceChannels(url, user.id);
    }
    async getWorkspaceChannel(url, name) {
        return this.channelsService.getWorkspaceChannel(url, name);
    }
    async createWorkspaceChannels(url, body, user) {
        return this.channelsService.createWorkspaceChannels(url, body.name, user.id);
    }
    async getWorkspaceChannelMembers(url, name) {
        return this.channelsService.getWorkspaceChannelMembers(url, name);
    }
    async createWorkspaceMembers(url, name, email) {
        return this.channelsService.createWorkspaceChannelMembers(url, name, email);
    }
    async getWorkspaceChannelChats(url, name, perPage, page) {
        return this.channelsService.getWorkspaceChannelChats(url, name, perPage, page);
    }
    async createWorkspaceChannelChats(url, name, content, user) {
        return this.channelsService.createWorkspaceChannelChats(url, name, content, user.id);
    }
    async createWorkspaceChannelImages(url, name, files, user) {
        return this.channelsService.createWorkspaceChannelImages(url, name, files, user.id);
    }
    async getUnreads(url, name, after) {
        return this.channelsService.getChannelUnreadsCount(url, name, after);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 모두 가져오기' }),
    common_1.Get(':url/channels'),
    __param(0, common_1.Param('url')), __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Users_1.Users]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannels", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 가져오기' }),
    common_1.Get(':url/channels/:name'),
    __param(0, common_1.Param('url')), __param(1, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannel", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 만들기' }),
    common_1.Post(':url/channels'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Body()),
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_channel_dto_1.CreateChannelDto,
        Users_1.Users]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannels", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 멤버 가져오기' }),
    common_1.Get(':url/channels/:name/members'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannelMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 멤버 초대하기' }),
    common_1.Post(':url/channels/:name/members'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 채팅 모두 가져오기' }),
    common_1.Get(':url/channels/:name/chats'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Query('perPage', common_1.ParseIntPipe)),
    __param(3, common_1.Query('page', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannelChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 채팅 생성하기' }),
    common_1.Post(':url/channels/:name/chats'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Body('content')),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Users_1.Users]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannelChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 이미지 업로드하기' }),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor('image', 10, {
        storage: multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                const ext = path_1.default.extname(file.originalname);
                cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    common_1.Post(':url/channels/:name/images'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.UploadedFiles()),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array, Users_1.Users]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannelImages", null);
__decorate([
    swagger_1.ApiOperation({ summary: '안 읽은 개수 가져오기' }),
    common_1.Get(':url/channels/:name/unreads'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Query('after', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getUnreads", null);
ChannelsController = __decorate([
    swagger_1.ApiTags('CHANNELS'),
    swagger_1.ApiCookieAuth('connect.sid'),
    common_1.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_1.Controller('api/workspaces'),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
exports.ChannelsController = ChannelsController;
//# sourceMappingURL=channels.controller.js.map