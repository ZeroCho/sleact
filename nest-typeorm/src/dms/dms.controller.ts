import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '../entities/Users';
import { DMsService } from './dms.service';

@ApiTags('DMS')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces')
export class DMsController {
  constructor(private dmsService: DMsService) {}

  @ApiOperation({ summary: '워크스페이스 DM 모두 가져오기' })
  @Get(':url/channels')
  async getWorkspaceChannels(@Param() url, @User() user: Users) {
    return this.dmsService.getWorkspaceDMs(url, user.id);
  }
}
