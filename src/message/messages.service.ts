import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ClientProxyFactory,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Transport,
} from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { Message } from '../message/schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
// import { SendMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private client: ClientProxy;

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly clientProxy: ClientProxy,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectQueue('messages') private readonly messageQueue: Queue,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = { senderId, receiverId, content, timestamp: new Date() };
    return this.clientProxy.emit('send_message', message).toPromise();
  }

  async getMessages(receiverId: string) {
    return this.clientProxy
      .send({ cmd: 'get_messages' }, { receiverId })
      .toPromise();
  }
}
