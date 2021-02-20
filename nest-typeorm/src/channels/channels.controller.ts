import { Controller, Get, UseGuards, Post, Body, Param } from '@nestjs/common';
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
  async getWorkspaceChannels(@Param() url, @User() user: Users) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 가져오기' })
  @Get(':url/channels/:channelId')
  async getWorkspaceChannel(@Param() url, @Param() channelId) {
    return this.channelsService.getWorkspaceChannel(url, +channelId);
  }

  @ApiOperation({ summary: '워크스페이스 채널 만들기' })
  @Post(':url/channels')
  async createWorkspaceChannels(
    @Param() url,
    @Body() body: CreateChannelDto,
    @User() user: Users,
  ) {
    return this.channelsService.createWorkspaceChannels(
      url,
      body.name,
      user.id,
    );
  }
}
