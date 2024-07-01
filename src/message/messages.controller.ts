import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('content') content: string,
  ) {
    await this.messagesService.sendMessage(senderId, receiverId, content);
    return { status: 'Message sent' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  async getMessages(@Query('receiverId') receiverId: string) {
    const messages = await this.messagesService.getMessages(receiverId);
    return { messages };
  }
}
