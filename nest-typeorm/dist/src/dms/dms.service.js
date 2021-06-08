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
exports.DMsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const onlineMap_1 = require("../events/onlineMap");
const typeorm_2 = require("typeorm");
const DMs_1 = require("../entities/DMs");
const Users_1 = require("../entities/Users");
const Workspaces_1 = require("../entities/Workspaces");
const events_gateway_1 = require("../events/events.gateway");
function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}
let DMsService = class DMsService {
    constructor(workspacesRepository, dmsRepository, usersRepository, eventsGateway) {
        this.workspacesRepository = workspacesRepository;
        this.dmsRepository = dmsRepository;
        this.usersRepository = usersRepository;
        this.eventsGateway = eventsGateway;
    }
    async getWorkspaceDMs(url, myId) {
        return (this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('user.dms', 'dms', 'dms.senderId = :myId', { myId })
            .leftJoin('dms', 'workspace', 'workspace.url = :url', { url })
            .getMany());
    }
    async getWorkspaceDMChats(url, id, myId, perPage, page) {
        return this.dmsRepository
            .createQueryBuilder('dms')
            .innerJoinAndSelect('dms.Sender', 'sender')
            .innerJoinAndSelect('dms.Receiver', 'receiver')
            .innerJoin('dms.Workspace', 'workspace')
            .where('workspace.url = :url', { url })
            .andWhere('((dms.SenderId = :myId AND dms.ReceiverId = :id) OR (dms.ReceiverId = :myId AND dms.SenderId = :id))', { id, myId })
            .orderBy('dms.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    async createWorkspaceDMChats(url, content, id, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const dm = new DMs_1.DMs();
        dm.SenderId = myId;
        dm.ReceiverId = id;
        dm.content = content;
        dm.WorkspaceId = workspace.id;
        const savedDm = await this.dmsRepository.save(dm);
        const dmWithSender = await this.dmsRepository.findOne({
            where: { id: savedDm.id },
            relations: ['Sender'],
        });
        const receiverSocketId = getKeyByValue(onlineMap_1.onlineMap[`/ws-${workspace.url}`], Number(id));
        this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
    }
    async createWorkspaceDMImages(url, files, id, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        for (let i = 0; i < files.length; i++) {
            const dm = new DMs_1.DMs();
            dm.SenderId = myId;
            dm.ReceiverId = id;
            dm.content = files[i].path;
            dm.WorkspaceId = workspace.id;
            const savedDm = await this.dmsRepository.save(dm);
            const dmWithSender = await this.dmsRepository.findOne({
                where: { id: savedDm.id },
                relations: ['Sender'],
            });
            const receiverSocketId = getKeyByValue(onlineMap_1.onlineMap[`/ws-${workspace.url}`], Number(id));
            this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
        }
    }
    async getDMUnreadsCount(url, id, myId, after) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        return this.dmsRepository.count({
            where: {
                WorkspaceId: workspace.id,
                SenderId: id,
                ReceiverId: myId,
                createdAt: typeorm_2.MoreThan(new Date(after)),
            },
        });
    }
};
DMsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Workspaces_1.Workspaces)),
    __param(1, typeorm_1.InjectRepository(DMs_1.DMs)),
    __param(2, typeorm_1.InjectRepository(Users_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        events_gateway_1.EventsGateway])
], DMsService);
exports.DMsService = DMsService;
//# sourceMappingURL=dms.service.js.map