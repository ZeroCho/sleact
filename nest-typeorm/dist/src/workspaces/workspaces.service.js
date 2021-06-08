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
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ChannelMembers_1 = require("../entities/ChannelMembers");
const Channels_1 = require("../entities/Channels");
const Users_1 = require("../entities/Users");
const WorkspaceMembers_1 = require("../entities/WorkspaceMembers");
const Workspaces_1 = require("../entities/Workspaces");
let WorkspacesService = class WorkspacesService {
    async findById(id) {
        return this.workspacesRepository.findOne({ where: { id } });
    }
    async findMyWorkspaces(myId) {
        return this.workspacesRepository.find({
            where: {
                WorkspaceMembers: [{ userId: myId }],
            },
        });
    }
    async createWorkspace(name, url, myId) {
        const workspace = new Workspaces_1.Workspaces();
        workspace.name = name;
        workspace.url = url;
        workspace.OwnerId = myId;
        const returned = await this.workspacesRepository.save(workspace);
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.UserId = myId;
        workspaceMember.WorkspaceId = returned.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channel = new Channels_1.Channels();
        channel.name = '일반';
        channel.WorkspaceId = returned.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceMembers(url) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.WorkspaceMembers', 'members')
            .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getMany();
    }
    async createWorkspaceMembers(url, email) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
            join: {
                alias: 'workspace',
                innerJoinAndSelect: {
                    channels: 'workspace.Channels',
                },
            },
        });
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.WorkspaceId = workspace.id;
        workspaceMember.UserId = user.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.ChannelId = workspace.Channels.find((v) => v.name === '일반').id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceMember(url, id) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
            url,
        })
            .getOne();
    }
};
__decorate([
    typeorm_1.InjectRepository(Workspaces_1.Workspaces),
    __metadata("design:type", typeorm_2.Repository)
], WorkspacesService.prototype, "workspacesRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(Channels_1.Channels),
    __metadata("design:type", typeorm_2.Repository)
], WorkspacesService.prototype, "channelsRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(WorkspaceMembers_1.WorkspaceMembers),
    __metadata("design:type", typeorm_2.Repository)
], WorkspacesService.prototype, "workspaceMembersRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(ChannelMembers_1.ChannelMembers),
    __metadata("design:type", typeorm_2.Repository)
], WorkspacesService.prototype, "channelMembersRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(Users_1.Users),
    __metadata("design:type", typeorm_2.Repository)
], WorkspacesService.prototype, "usersRepository", void 0);
WorkspacesService = __decorate([
    common_1.Injectable()
], WorkspacesService);
exports.WorkspacesService = WorkspacesService;
//# sourceMappingURL=workspaces.service.js.map