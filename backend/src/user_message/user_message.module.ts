import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserMessage } from './user_message.model';
import { UserMessageService } from './user_message.service';
import { UserMessageController } from './user_message.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserMessage])],
  controllers: [UserMessageController],
  providers: [UserMessageService],
})
export class UserMessageModule {}
