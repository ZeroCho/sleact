import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';

@Injectable()
export class DMsService {
  constructor(
    @InjectRepository(DMs) private dmsRepository: Repository<DMs>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
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
    return this.dmsRepository.find({
      where: {
        senderId: myId,
        receiverId: id,
      },
      order: {
        createdAt: 'DESC',
      },
      take: perPage,
      skip: perPage * (page - 1),
    });
  }
}
