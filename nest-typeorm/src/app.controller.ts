import { Controller, Get, Response } from '@nestjs/common';
import { AppService } from './app.service';
import path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Response() res) {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
  }
}
