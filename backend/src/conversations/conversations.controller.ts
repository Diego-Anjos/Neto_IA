import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
  ) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.conversationsService.findByUser(userId);
  }

  @Post()
  create(@Body() body: { userId: string; title?: string }) {
    return this.conversationsService.create(body.userId, body.title);
  }

  @Patch(':id')
  updateTitle(@Param('id') id: string, @Body() body: { title: string }) {
    return this.conversationsService.updateTitle(id, body.title);
  }

  @Delete('user/:userId')
  removeByUser(@Param('userId') userId: string) {
    return this.conversationsService.removeByUser(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(id);
  }
}
