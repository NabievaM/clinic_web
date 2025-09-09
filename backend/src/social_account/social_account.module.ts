import { Module } from '@nestjs/common';
import { SocialAccountService } from './social_account.service';
import { SocialAccountController } from './social_account.controller';
import { SocialAccount } from './social_account.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([SocialAccount])],
  controllers: [SocialAccountController],
  providers: [SocialAccountService],
  exports: [SocialAccountService],
})
export class SocialAccountModule {}
