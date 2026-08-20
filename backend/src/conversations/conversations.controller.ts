import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { ConversationsService } from './conversations.service';
import {
  CreateConversationDto,
  UpdateConversationDto,
} from './dto/conversation.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
  ) {}

  @Get()
  findMine(@CurrentUser() user: AuthUser) {
    return this.conversationsService.findByUser(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateConversationDto,
  ) {
    return this.conversationsService.create(user.id, body.title);
  }

  @Patch(':id')
  updateTitle(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateConversationDto,
  ) {
    return this.conversationsService.updateTitle(id, body.title, user.id);
  }

  @Delete()
  removeMine(@CurrentUser() user: AuthUser) {
    return this.conversationsService.removeByUser(user.id);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.conversationsService.remove(id, user.id);
  }
}
