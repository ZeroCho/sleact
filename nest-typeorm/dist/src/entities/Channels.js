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
exports.Channels = void 0;
const typeorm_1 = require("typeorm");
const ChannelChats_1 = require("./ChannelChats");
const ChannelMembers_1 = require("./ChannelMembers");
const Users_1 = require("./Users");
const Workspaces_1 = require("./Workspaces");
let Channels = class Channels {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Channels.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'name', length: 30 }),
    __metadata("design:type", String)
], Channels.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('tinyint', {
        name: 'private',
        nullable: true,
        width: 1,
        default: () => "'0'",
    }),
    __metadata("design:type", Boolean)
], Channels.prototype, "private", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Channels.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Channels.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], Channels.prototype, "WorkspaceId", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelChats_1.ChannelChats, (channelchats) => channelchats.Channel),
    __metadata("design:type", Array)
], Channels.prototype, "ChannelChats", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelMembers_1.ChannelMembers, (channelMembers) => channelMembers.Channel, {
        cascade: ['insert'],
    }),
    __metadata("design:type", Array)
], Channels.prototype, "ChannelMembers", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, (users) => users.Channels),
    __metadata("design:type", Array)
], Channels.prototype, "Members", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Channels, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", Workspaces_1.Workspaces)
], Channels.prototype, "Workspace", void 0);
Channels = __decorate([
    typeorm_1.Index('WorkspaceId', ['WorkspaceId'], {}),
    typeorm_1.Entity({ schema: 'sleact' })
], Channels);
exports.Channels = Channels;
//# sourceMappingURL=Channels.js.map