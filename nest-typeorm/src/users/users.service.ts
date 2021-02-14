import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from '../entities/Users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async join(email: string, nickname: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return false;
    }
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    return true;
  }
}
