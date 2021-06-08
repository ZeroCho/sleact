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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const ChannelChats_1 = require("./ChannelChats");
const ChannelMembers_1 = require("./ChannelMembers");
const Channels_1 = require("./Channels");
const DMs_1 = require("./DMs");
const Mentions_1 = require("./Mentions");
const WorkspaceMembers_1 = require("./WorkspaceMembers");
const Workspaces_1 = require("./Workspaces");
let Users = class Users {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'email', unique: true, length: 30 }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'nickname', length: 30 }),
    __metadata("design:type", String)
], Users.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'password', length: 100, select: false }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn(),
    __metadata("design:type", Date)
], Users.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelChats_1.ChannelChats, (channelchats) => channelchats.User),
    __metadata("design:type", Array)
], Users.prototype, "ChannelChats", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelMembers_1.ChannelMembers, (channelmembers) => channelmembers.User),
    __metadata("design:type", Array)
], Users.prototype, "ChannelMembers", void 0);
__decorate([
    typeorm_1.OneToMany(() => DMs_1.DMs, (dms) => dms.Sender),
    __metadata("design:type", Array)
], Users.prototype, "DMs", void 0);
__decorate([
    typeorm_1.OneToMany(() => DMs_1.DMs, (dms) => dms.Receiver),
    __metadata("design:type", Array)
], Users.prototype, "DMs2", void 0);
__decorate([
    typeorm_1.OneToMany(() => Mentions_1.Mentions, (mentions) => mentions.Sender),
    __metadata("design:type", Array)
], Users.prototype, "Mentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => Mentions_1.Mentions, (mentions) => mentions.Receiver),
    __metadata("design:type", Array)
], Users.prototype, "Mentions2", void 0);
__decorate([
    typeorm_1.OneToMany(() => WorkspaceMembers_1.WorkspaceMembers, (workspacemembers) => workspacemembers.User),
    __metadata("design:type", Array)
], Users.prototype, "WorkspaceMembers", void 0);
__decorate([
    typeorm_1.OneToMany(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Owner),
    __metadata("design:type", Array)
], Users.prototype, "OwnedWorkspaces", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Members),
    typeorm_1.JoinTable({
        name: 'workspacemembers',
        joinColumn: {
            name: 'UserId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'WorkspaceId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "Workspaces", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Channels_1.Channels, (channels) => channels.Members),
    typeorm_1.JoinTable({
        name: 'channelmembers',
        joinColumn: {
            name: 'UserId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'ChannelId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "Channels", void 0);
Users = __decorate([
    typeorm_1.Index('email', ['email'], { unique: true }),
    typeorm_1.Entity({ schema: 'sleact', name: 'users' })
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map