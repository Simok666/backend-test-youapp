import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Message } from '../message/schemas/message.schema';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQListenerService {
  private readonly logger = new Logger(RabbitMQListenerService.name);
  constructor(
    @InjectModel('Message')
    private readonly messageModel: Model<Message>,
    @InjectQueue('messages')
    private readonly messageQueue: Queue,
    // private readonly configService: ConfigService,
  ) {
    this.listenForMessages();
  }

  @MessagePattern('send_message')
  async handleMessage(@Payload() message: any) {
    console.log('Received message:', message);
    const createdMessage = new this.messageModel(message);
    await createdMessage.save();
    return { status: 'Message received' };
  }

  @MessagePattern({ cmd: 'get_messages' })
  async getMessages(@Payload() data: { receiverId: string }) {
    const messages = await this.messageModel
      .find({ receiverId: data.receiverId })
      .exec();
    return messages;
  }

  private async listenForMessages() {
    try {
      await this.messageQueue.process(async (job) => {
        const { senderId, receiverId, content } = job.data;
        const message = new this.messageModel({
          senderId,
          receiverId,
          content,
        });
        await message.save();
        this.logger.log(`Message from ${senderId} to ${receiverId} saved.`);
      });
    } catch (error) {
      this.logger.error('Error in listening for messages:', error);
    }
  }
}
