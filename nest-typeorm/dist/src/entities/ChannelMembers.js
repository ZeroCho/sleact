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
exports.ChannelMembers = void 0;
const typeorm_1 = require("typeorm");
const Channels_1 = require("./Channels");
const Users_1 = require("./Users");
let ChannelMembers = class ChannelMembers {
};
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ChannelMembers.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ChannelMembers.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'ChannelId' }),
    __metadata("design:type", Number)
], ChannelMembers.prototype, "ChannelId", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'UserId' }),
    __metadata("design:type", Number)
], ChannelMembers.prototype, "UserId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Channels_1.Channels, (channels) => channels.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }]),
    __metadata("design:type", Channels_1.Channels)
], ChannelMembers.prototype, "Channel", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], ChannelMembers.prototype, "User", void 0);
ChannelMembers = __decorate([
    typeorm_1.Index('UserId', ['UserId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'channelmembers' })
], ChannelMembers);
exports.ChannelMembers = ChannelMembers;
//# sourceMappingURL=ChannelMembers.js.map