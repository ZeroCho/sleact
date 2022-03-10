import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor() {}

  getUser() {}
  postUsers(email: string, nickname: string, password: string) {}
}
