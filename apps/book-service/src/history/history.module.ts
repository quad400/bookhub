import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './repo/history.repo';
import { BookRepository } from '../book/repos/book.repo';
import { RmqModule, USER_SERVICE } from '@app/common';
import { ModelModule } from 'apps/book-service/config/model.module';

@Module({
  imports: [
    ModelModule,
    RmqModule.register({
      name: USER_SERVICE,
    }),
  ],
  controllers: [HistoryController],
  providers: [HistoryService, HistoryRepository, BookRepository],
})
export class HistoryModule {}
