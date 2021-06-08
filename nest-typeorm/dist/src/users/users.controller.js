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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const local_auth_guard_1 = require("../auth/local-auth.guard");
const not_logged_in_guard_1 = require("../auth/not-logged-in.guard");
const logged_in_guard_1 = require("../auth/logged-in.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const Users_1 = require("../entities/Users");
const join_request_dto_1 = require("./dto/join.request.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(user) {
        return user || false;
    }
    async login(user) {
        return user;
    }
    async join(data) {
        const user = this.usersService.findByEmail(data.email);
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const result = await this.usersService.join(data.email, data.nickname, data.password);
        if (result) {
            return 'ok';
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async logout(res) {
        res.clearCookie('connect.sid', { httpOnly: true });
        return res.send('ok');
    }
};
__decorate([
    swagger_1.ApiCookieAuth('connect.sid'),
    swagger_1.ApiOperation({ summary: '내 정보 가져오기' }),
    common_1.Get(),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    swagger_1.ApiOperation({ summary: '로그인' }),
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post('login'),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    swagger_1.ApiOperation({ summary: '회원가입' }),
    common_1.UseGuards(not_logged_in_guard_1.NotLoggedInGuard),
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_request_dto_1.JoinRequestDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "join", null);
__decorate([
    swagger_1.ApiCookieAuth('connect.sid'),
    swagger_1.ApiOperation({ summary: '로그아웃' }),
    common_1.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_1.Post('logout'),
    __param(0, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
UsersController = __decorate([
    swagger_1.ApiTags('USERS'),
    common_1.Controller('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map