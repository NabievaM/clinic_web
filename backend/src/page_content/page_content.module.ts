import { Module } from '@nestjs/common';
import { PageContentService } from './page_content.service';
import { PageContentController } from './page_content.controller';
import { PageContent } from './page_content.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([PageContent])],
  controllers: [PageContentController],
  providers: [PageContentService],
  exports: [PageContentService],
})
export class PageContentModule {}
