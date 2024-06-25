import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nestjs-chat-app'), // Update the connection string if necessary
    UsersModule,
    AuthModule,
    // ChatModule,
  ],
})
export class AppModule {}
