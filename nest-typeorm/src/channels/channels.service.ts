import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channels } from '../entities/Channels';

@Injectable()
export class ChannelsService {
  @InjectRepository(Channels) private channelsRepository: Repository<Channels>;

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }
}
