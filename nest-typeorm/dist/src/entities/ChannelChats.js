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
exports.ChannelChats = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const Channels_1 = require("./Channels");
let ChannelChats = class ChannelChats {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text', { name: 'content' }),
    __metadata("design:type", String)
], ChannelChats.prototype, "content", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ChannelChats.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ChannelChats.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'UserId', nullable: true }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "UserId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'ChannelId', nullable: true }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "ChannelId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], ChannelChats.prototype, "User", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Channels_1.Channels, (channels) => channels.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }]),
    __metadata("design:type", Channels_1.Channels)
], ChannelChats.prototype, "Channel", void 0);
ChannelChats = __decorate([
    typeorm_1.Index('UserId', ['UserId'], {}),
    typeorm_1.Index('ChannelId', ['ChannelId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'channelchats' })
], ChannelChats);
exports.ChannelChats = ChannelChats;
//# sourceMappingURL=ChannelChats.js.map