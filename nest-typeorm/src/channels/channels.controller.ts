import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '../entities/Users';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';

@ApiTags('CHANNELS')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @ApiOperation({ summary: '워크스페이스 채널 모두 가져오기' })
  @Get(':url/channels')
  async getWorkspaceChannels(@Param('url') url, @User() user: Users) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 가져오기' })
  @Get(':url/channels/:name')
  async getWorkspaceChannel(@Param('url') url, @Param('name') name) {
    return this.channelsService.getWorkspaceChannel(url, name);
  }

  @ApiOperation({ summary: '워크스페이스 채널 만들기' })
  @Post(':url/channels')
  async createWorkspaceChannels(
    @Param('url') url,
    @Body() body: CreateChannelDto,
    @User() user: Users,
  ) {
    return this.channelsService.createWorkspaceChannels(
      url,
      body.name,
      user.id,
    );
  }

  @ApiOperation({ summary: '워크스페이스 채널 멤버 가져오기' })
  @Get(':url/channels/:name/members')
  async getWorkspaceChannelMembers(
    @Param('url') url: string,
    @Param('name') name: string,
  ) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @ApiOperation({ summary: '워크스페이스 채널 멤버 초대하기' })
  @Post(':url/channels/:name/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body('email') email,
  ) {
    return this.channelsService.createWorkspaceChannelMembers(url, name, email);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 채팅 모두 가져오기' })
  @Get(':url/channels/:name/chats')
  async getWorkspaceChannelChats(
    @Param('url') url,
    @Param('name') name,
    @Query('perPage') perPage,
    @Query('page') page,
  ) {
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      +perPage,
      +page,
    );
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 채팅 생성하기' })
  @Post(':url/channels/:name/chats')
  async createWorkspaceChannelChats(
    @Param('url') url,
    @Param('name') name,
    @Body('content') content,
    @User() user: Users,
  ) {
    return this.channelsService.createWorkspaceChannelChats(
      url,
      name,
      content,
      user.id,
    );
  }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get(':url/channels/:name/unreads')
  async getUnreads(@Query('after') after: number) {
    return 0;
  }
}
