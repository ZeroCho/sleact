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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const onlineMap_1 = require("./onlineMap");
let EventsGateway = class EventsGateway {
    handleTest(data) {
        console.log('test', data);
    }
    handleLogin(data, socket) {
        const newNamespace = socket.nsp;
        console.log('login', newNamespace);
        onlineMap_1.onlineMap[socket.nsp.name][socket.id] = data.id;
        newNamespace.emit('onlineList', Object.values(onlineMap_1.onlineMap[socket.nsp.name]));
        data.channels.forEach((channel) => {
            console.log('join', socket.nsp.name, channel);
            socket.join(`${socket.nsp.name}-${channel}`);
        });
    }
    afterInit(server) {
        console.log('init');
    }
    handleConnection(socket) {
        console.log('connected', socket.nsp.name);
        if (!onlineMap_1.onlineMap[socket.nsp.name]) {
            onlineMap_1.onlineMap[socket.nsp.name] = {};
        }
        socket.emit('hello', socket.nsp.name);
    }
    handleDisconnect(socket) {
        console.log('disconnected', socket.nsp.name);
        const newNamespace = socket.nsp;
        delete onlineMap_1.onlineMap[socket.nsp.name][socket.id];
        newNamespace.emit('onlineList', Object.values(onlineMap_1.onlineMap[socket.nsp.name]));
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], EventsGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('test'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleTest", null);
__decorate([
    websockets_1.SubscribeMessage('login'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLogin", null);
__decorate([
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleDisconnect", null);
EventsGateway = __decorate([
    websockets_1.WebSocketGateway({ namespace: /\/ws-.+/ })
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=events.gateway.js.map