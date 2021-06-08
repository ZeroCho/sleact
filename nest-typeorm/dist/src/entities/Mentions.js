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
exports.Mentions = void 0;
const typeorm_1 = require("typeorm");
const Workspaces_1 = require("./Workspaces");
const Users_1 = require("./Users");
let Mentions = class Mentions {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Mentions.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('enum', { name: 'category', enum: ['chat', 'dm', 'system'] }),
    __metadata("design:type", String)
], Mentions.prototype, "type", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'ChatId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "ChatId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Mentions.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Mentions.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "WorkspaceId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'SenderId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "SenderId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'ReceiverId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "ReceiverId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Mentions, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", Workspaces_1.Workspaces)
], Mentions.prototype, "Workspace", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.Mentions, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], Mentions.prototype, "Sender", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.Mentions2, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], Mentions.prototype, "Receiver", void 0);
Mentions = __decorate([
    typeorm_1.Index('WorkspaceId', ['WorkspaceId'], {}),
    typeorm_1.Index('SenderId', ['SenderId'], {}),
    typeorm_1.Index('ReceiverId', ['ReceiverId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'mentions' })
], Mentions);
exports.Mentions = Mentions;
//# sourceMappingURL=Mentions.js.map