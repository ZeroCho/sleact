"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.DMsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs = __importStar(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const logged_in_guard_1 = require("../auth/logged-in.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const Users_1 = require("../entities/Users");
const dms_service_1 = require("./dms.service");
try {
    fs.readdirSync('uploads');
}
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
let DMsController = class DMsController {
    constructor(dmsService) {
        this.dmsService = dmsService;
    }
    async getWorkspaceChannels(url, user) {
        return this.dmsService.getWorkspaceDMs(url, user.id);
    }
    async getWorkspaceDMChats(url, id, perPage, page, user) {
        return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
    }
    async createWorkspaceDMChats(url, id, content, user) {
        return this.dmsService.createWorkspaceDMChats(url, content, id, user.id);
    }
    async createWorkspaceDMImages(url, id, files, user) {
        return this.dmsService.createWorkspaceDMImages(url, files, id, user.id);
    }
    async getUnreads(url, id, after, user) {
        return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 DM 모두 가져오기' }),
    common_2.Get(':url/dms'),
    __param(0, common_2.Param('url')), __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Users_1.Users]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getWorkspaceChannels", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 DM 채팅 모두 가져오기' }),
    common_2.Get(':url/dms/:id/chats'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.Query('perPage', common_1.ParseIntPipe)),
    __param(3, common_2.Query('page', common_1.ParseIntPipe)),
    __param(4, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, Users_1.Users]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getWorkspaceDMChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 DM 채팅 생성하기' }),
    common_2.Post(':url/dms/:id/chats'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.Body('content')),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Users_1.Users]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "createWorkspaceDMChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 DM 이미지 업로드하기' }),
    common_2.UseInterceptors(platform_express_1.FilesInterceptor('image', 10, {
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
    common_2.Post(':url/dms/:id/images'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.UploadedFiles()),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Array, Users_1.Users]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "createWorkspaceDMImages", null);
__decorate([
    swagger_1.ApiOperation({ summary: '안 읽은 개수 가져오기' }),
    common_2.Get(':url/dms/:id/unreads'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.Query('after', common_1.ParseIntPipe)),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Users_1.Users]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getUnreads", null);
DMsController = __decorate([
    swagger_1.ApiTags('DMS'),
    swagger_1.ApiCookieAuth('connect.sid'),
    common_2.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_2.Controller('api/workspaces'),
    __metadata("design:paramtypes", [dms_service_1.DMsService])
], DMsController);
exports.DMsController = DMsController;
//# sourceMappingURL=dms.controller.js.map