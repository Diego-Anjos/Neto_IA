import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversation/:conversationId')
  findByConversation(@Param('conversationId') conversationId: string) {
    return this.messagesService.findByConversation(conversationId);
  }

  @Post()
  create(
    @Body()
    body: {
      conversationId: string;
      role: string;
      content: unknown;
    },
  ) {
    return this.messagesService.create(
      body.conversationId,
      body.role,
      body.content,
    );
  }
}
