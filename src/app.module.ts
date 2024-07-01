import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './message/messages.module';
import { RabbitMQListenerModule } from './microservices/rabbitmq-listener.module';
import { Message, MessageSchema } from './message/schemas/message.schema';
import { BullModule } from '@nestjs/bull';

// import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
// import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    MongooseModule.forRoot('mongodb://mongo:27017/nestjs-chat-app'), // Update the connection string if necessary
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UsersModule,
    AuthModule,
    MessagesModule,
    RabbitMQListenerModule,
    // RabbitMQModule,
    // MessageModule,
  ],
})
export class AppModule {}
