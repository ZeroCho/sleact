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
exports.WorkspaceMembers = void 0;
const typeorm_1 = require("typeorm");
const Workspaces_1 = require("./Workspaces");
const Users_1 = require("./Users");
let WorkspaceMembers = class WorkspaceMembers {
};
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], WorkspaceMembers.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], WorkspaceMembers.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'WorkspaceId' }),
    __metadata("design:type", Number)
], WorkspaceMembers.prototype, "WorkspaceId", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'UserId' }),
    __metadata("design:type", Number)
], WorkspaceMembers.prototype, "UserId", void 0);
__decorate([
    typeorm_1.Column('datetime', { name: 'loggedInAt', nullable: true }),
    __metadata("design:type", Date)
], WorkspaceMembers.prototype, "loggedInAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Workspaces_1.Workspaces, (workspaces) => workspaces.WorkspaceMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", Workspaces_1.Workspaces)
], WorkspaceMembers.prototype, "Workspace", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.WorkspaceMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], WorkspaceMembers.prototype, "User", void 0);
WorkspaceMembers = __decorate([
    typeorm_1.Index('UserId', ['UserId'], {}),
    typeorm_1.Entity('workspacemembers', { schema: 'sleact' })
], WorkspaceMembers);
exports.WorkspaceMembers = WorkspaceMembers;
//# sourceMappingURL=WorkspaceMembers.js.map