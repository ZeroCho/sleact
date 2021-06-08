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
exports.Workspaces = void 0;
const typeorm_1 = require("typeorm");
const Channels_1 = require("./Channels");
const DMs_1 = require("./DMs");
const Mentions_1 = require("./Mentions");
const WorkspaceMembers_1 = require("./WorkspaceMembers");
const Users_1 = require("./Users");
let Workspaces = class Workspaces {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Workspaces.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'name', unique: true, length: 30 }),
    __metadata("design:type", String)
], Workspaces.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'url', unique: true, length: 30 }),
    __metadata("design:type", String)
], Workspaces.prototype, "url", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Workspaces.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Workspaces.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn(),
    __metadata("design:type", Date)
], Workspaces.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'OwnerId', nullable: true }),
    __metadata("design:type", Number)
], Workspaces.prototype, "OwnerId", void 0);
__decorate([
    typeorm_1.OneToMany(() => Channels_1.Channels, (channels) => channels.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "Channels", void 0);
__decorate([
    typeorm_1.OneToMany(() => DMs_1.DMs, (dms) => dms.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "DMs", void 0);
__decorate([
    typeorm_1.OneToMany(() => Mentions_1.Mentions, (mentions) => mentions.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "Mentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => WorkspaceMembers_1.WorkspaceMembers, (workspacemembers) => workspacemembers.Workspace, { cascade: ['insert'] }),
    __metadata("design:type", Array)
], Workspaces.prototype, "WorkspaceMembers", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.Workspaces, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], Workspaces.prototype, "Owner", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, (users) => users.Workspaces),
    __metadata("design:type", Array)
], Workspaces.prototype, "Members", void 0);
Workspaces = __decorate([
    typeorm_1.Index('name', ['name'], { unique: true }),
    typeorm_1.Index('url', ['url'], { unique: true }),
    typeorm_1.Index('OwnerId', ['OwnerId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'workspaces' })
], Workspaces);
exports.Workspaces = Workspaces;
//# sourceMappingURL=Workspaces.js.map