import { Module } from '@nestjs/common';
import { BookService } from './services/book.service';
import { BookController } from './controllers/book.controller';
import { ModelModule } from 'apps/book-service/config/model.module';
import { BookRepository } from './repos/book.repo';
import { RmqModule, RmqService, USER_SERVICE } from '@app/common';

@Module({
  imports: [
    ModelModule,

    RmqModule.register({
      name: USER_SERVICE,
    }),
  ],
  controllers: [BookController],
  providers: [BookService, BookRepository, RmqService],
})
export class BookModule {}
