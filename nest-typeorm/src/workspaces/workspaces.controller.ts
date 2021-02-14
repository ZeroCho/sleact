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
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('WORKSPACES')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @ApiOperation({ summary: '내 워크스페이스 가져오기' })
  @Get()
  async getMyWorkspaces(@Request() req) {
    return this.workspacesService.findMyWorkspaces(req.user.id);
  }

  @ApiOperation({ summary: '워크스페이스 만들기' })
  @Post()
  async createWorkspace(@Request() req, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      req.user.id,
    );
  }

  @ApiOperation({ summary: '워크스페이스 채널 모두 가져오기' })
  @Get(':url/channels')
  async getWorkspaceChannels(@Param() url, @Request() req) {
    return this.workspacesService.getWorkspaceChannels(url, req.user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 가져오기' })
  @Get(':url/channels/:channelId')
  async getWorkspaceChannel(@Param() url, @Param() channelId) {
    return this.workspacesService.getWorkspaceChannel(url, +channelId);
  }

  @ApiOperation({ summary: '워크스페이스 채널 만들기' })
  @Post(':url/channels')
  async createWorkspaceChannels(
    @Param() url,
    @Body() body: CreateChannelDto,
    @Request() req,
  ) {
    return this.workspacesService.createWorkspaceChannels(
      url,
      body.name,
      req.user.id,
    );
  }
}
