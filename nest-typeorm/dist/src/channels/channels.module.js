"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ChannelChats_1 = require("../entities/ChannelChats");
const ChannelMembers_1 = require("../entities/ChannelMembers");
const Channels_1 = require("../entities/Channels");
const Users_1 = require("../entities/Users");
const Workspaces_1 = require("../entities/Workspaces");
const events_gateway_1 = require("../events/events.gateway");
const channels_service_1 = require("./channels.service");
const channels_controller_1 = require("./channels.controller");
let ChannelsModule = class ChannelsModule {
};
ChannelsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Channels_1.Channels,
                ChannelChats_1.ChannelChats,
                Users_1.Users,
                Workspaces_1.Workspaces,
                ChannelMembers_1.ChannelMembers,
            ]),
        ],
        providers: [channels_service_1.ChannelsService, events_gateway_1.EventsGateway],
        controllers: [channels_controller_1.ChannelsController],
    })
], ChannelsModule);
exports.ChannelsModule = ChannelsModule;
//# sourceMappingURL=channels.module.js.map