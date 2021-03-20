import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { onlineMap } from 'src/events/onlineMap';
import { Repository } from 'typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { EventsGateway } from '../events/events.gateway';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

@Injectable()
export class DMsService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(DMs) private dmsRepository: Repository<DMs>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}
  async getWorkspaceDMs(url: string, myId: number) {
    return (
      this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.dms', 'dms', 'dms.senderId = :myId', { myId })
        .leftJoin('dms', 'workspace', 'workspace.url = :url', { url })
        // .groupBy('dms.senderId')
        .getMany()
    );
  }

  async getWorkspaceDMChats(
    url: string,
    id: number,
    myId: number,
    perPage: number,
    page: number,
  ) {
    return this.dmsRepository
      .createQueryBuilder('dms')
      .innerJoinAndSelect('dms.sender', 'sender')
      .innerJoinAndSelect('dms.receiver', 'receiver')
      .innerJoin('dms.workspace', 'workspace')
      .where('dms.senderId = :myId', { myId })
      .andWhere('dms.receiverId = :id', { id })
      .andWhere('workspace.url = :url', { url })
      .orderBy('dms.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceDMChats(
    url: string,
    content: string,
    id: number,
    myId: number,
  ) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    const dm = new DMs();
    dm.SenderId = myId;
    dm.ReceiverId = id;
    dm.content = content;
    dm.WorkspaceId = workspace.id;
    const savedDm = await this.dmsRepository.save(dm);
    const dmWithSender = await this.dmsRepository.findOne({
      where: { id: savedDm.id },
      relations: ['Sender'],
    });
    const receiverSocketId = getKeyByValue(
      onlineMap[`/ws-${workspace.url}`],
      Number(id),
    );
    this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
  }
}
