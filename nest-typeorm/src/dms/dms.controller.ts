import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Param,
  Query,
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
  @Get(':url/dms')
  async getWorkspaceChannels(@Param('url') url, @User() user: Users) {
    return this.dmsService.getWorkspaceDMs(url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅 모두 가져오기' })
  @Get(':url/dms/:id/chats')
  async getWorkspaceDMChats(
    @Param('url') url,
    @Param('id') id,
    @Query('perPage') perPage,
    @Query('page') page,
    @User() user: Users,
  ) {
    return this.dmsService.getWorkspaceDMChats(
      url,
      +id,
      user.id,
      +perPage,
      +page,
    );
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅 생성하기' })
  @Post(':url/dms/:id/chats')
  async createWorkspaceDMChats(
    @Param('url') url,
    @Param('id') id,
    @Body('content') content,
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMChats(url, content, +id, user.id);
  }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get(':url/dms/:id/unreads')
  async getUnreads(@Query('after') after: number) {
    return 0;
  }
}
