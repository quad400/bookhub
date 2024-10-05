import { HistoryService } from './history.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  BOOK_SERVICE,
  CurrentUser,
  QueryDto,
  QueryWithoutSearchDto,
} from '@app/common';
import { ApproveReturnedBookDto } from './dto/history.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @MessagePattern('borrow_book')
  async borrowBook(
    @Payload() data: { userId: string; bookId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.historyService.borrowBook(
      data.userId,
      data.bookId,
      context,
    );
  }

  @MessagePattern('get_borrowed_books')
  async getBorrowedBooks(
    @Payload() data: { userId: string; query: QueryWithoutSearchDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.historyService.getBorrowedBooks(
      data.userId,
      data.query,
      context,
    );
  }

  @MessagePattern('get_borrowed_book')
  async getBorrowedBook(
    @Payload() data: { borrowedBookId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.historyService.getBorrowedBook(
      data.borrowedBookId,
      context,
    );
  }

  @MessagePattern('return_borrowed_book')
  async returnBorrowedBook(
    @Payload() data: { borrowedBookId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.historyService.returnBorrowedBook(
      data.borrowedBookId,
      data.userId,
      context,
    );
  }

  @MessagePattern('approve_borrowed_book')
  async approveReturnedBook(
    @Payload()
    data: {
      borrowedBookId: string;
      userId: string;
      data: ApproveReturnedBookDto;
    },
    @Ctx() context: RmqContext,
  ) {
    return await this.historyService.approveReturnedBook(
      data.borrowedBookId,
      data.userId,
      data.data,
      context,
    );
  }

  @MessagePattern('get_lend_books')
  async getLendBooks(
    @Payload() data: { query: QueryWithoutSearchDto; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.historyService.getLendBooks(
      data.query,
      data.userId,
      context,
    );
  }
}
