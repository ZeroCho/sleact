import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from '../entities/Users';

@Injectable()
export class UsersService {
  @InjectRepository(Users) private usersRepository: Repository<Users>;

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async join(email: string, nickname: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new Users();
    user.email = email;
    user.nickname = nickname;
    user.password = password;
    user.workspaceMembers = [{ workspaceId: 1 }];
    user.channelMembers = [{ channelId: 1 }];
    this.usersRepository.save(user);
  }
}
