import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQListenerService } from './rabbitmq-listener.service';
import { MessageSchema } from '../message/schemas/message.schema';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    BullModule.registerQueue({
      name: 'messages',
    }),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'messages_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RabbitMQListenerService],
  exports: [RabbitMQListenerService],
})
export class RabbitMQListenerModule {}
