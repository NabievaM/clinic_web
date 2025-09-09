import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from './user.model';
import { AuthModule } from '../common/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), JwtModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
