import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversation/:conversationId')
  findByConversation(
    @CurrentUser() user: AuthUser,
    @Param('conversationId', new ParseUUIDPipe({ version: '4' }))
    conversationId: string,
  ) {
    return this.messagesService.findByConversation(conversationId, user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: CreateMessageDto) {
    return this.messagesService.create(
      body.conversationId,
      body.role,
      body.content,
      user.id,
    );
  }
}
