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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ChannelMembers_1 = require("../entities/ChannelMembers");
const Users_1 = require("../entities/Users");
const WorkspaceMembers_1 = require("../entities/WorkspaceMembers");
let UsersService = class UsersService {
    constructor(usersRepository, workspaceMembersRepository, channelMembersRepository) {
        this.usersRepository = usersRepository;
        this.workspaceMembersRepository = workspaceMembersRepository;
        this.channelMembersRepository = channelMembersRepository;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password'],
        });
    }
    async join(email, nickname, password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user) {
            return false;
        }
        const returned = await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.UserId = returned.id;
        workspaceMember.WorkspaceId = 1;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = returned.id;
        channelMember.ChannelId = 1;
        await this.channelMembersRepository.save(channelMember);
        return true;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Users_1.Users)),
    __param(1, typeorm_1.InjectRepository(WorkspaceMembers_1.WorkspaceMembers)),
    __param(2, typeorm_1.InjectRepository(ChannelMembers_1.ChannelMembers)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map