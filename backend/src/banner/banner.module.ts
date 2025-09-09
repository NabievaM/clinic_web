import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { Banner } from './banner.model';
import {FileModule} from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([Banner]), FileModule],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
