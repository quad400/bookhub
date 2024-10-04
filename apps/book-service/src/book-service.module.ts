import { Module } from '@nestjs/common';
import { BookServiceController } from './book-service.controller';
import { BookServiceService } from './book-service.service';
import {
  AppConfigModule,
  DatabaseModule,
  RmqModule,
  RmqService,
  USER_SERVICE,
} from '@app/common';
import { ModelModule } from '../config/model.module';
import { BookConfigModule } from '../config/book-config.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    BookConfigModule,
    RmqModule,
    DatabaseModule,
    AppConfigModule,
    ModelModule,
    BookModule,
  ],
  controllers: [BookServiceController],
  providers: [BookServiceService, RmqService],
})
export class BookServiceModule {}
