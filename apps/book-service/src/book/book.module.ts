import { Module } from '@nestjs/common';
import { BookService } from './services/book.service';
import { BookController } from './controllers/book.controller';
import { ModelModule } from 'apps/book-service/config/model.module';
import { BookRepository } from './repos/book.repo';
import { RmqModule, RmqService, USER_SERVICE } from '@app/common';
import { FeedbackRepository } from './repos/feedback.repo';
import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackService } from './services/feedback.service';
import { HistoryRepository } from '../history/repo/history.repo';

@Module({
  imports: [
    ModelModule,

    RmqModule.register({
      name: USER_SERVICE,
    }),
  ],
  controllers: [BookController, FeedbackController],
  providers: [
    BookService,
    BookRepository,
    FeedbackRepository,
    FeedbackService,
    HistoryRepository,
    RmqService,
  ],
})
export class BookModule {}
