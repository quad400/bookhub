import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  BOOK_SERVICE,
  CurrentUser,
  QueryWithoutSearchDto,
  User,
} from '@app/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { ApproveReturnedBookDto } from 'apps/book-service/src/history/dto/history.dto';

@UseInterceptors(CacheInterceptor)
@ApiTags('History')
@ApiBearerAuth()
@Controller('history')
export class HistoryController {
  constructor(@Inject(BOOK_SERVICE) private bookClient: ClientProxy) {}

  @ApiOperation({ description: 'Borrow Book' })
  @Post('/borrow-book/:bookId')
  async borrowBook(@CurrentUser() user: User, @Param('bookId') bookId: string) {
    return this.bookClient.send('borrow_book', { userId: user._id, bookId });
  }

  @CacheKey('GET_BORROWED_BOOKS')
  @ApiOperation({ description: 'Get Borrowed Books' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @Get('get-borrowed-books')
  async getBorrowedBooks(
    @Query() query: QueryWithoutSearchDto,
    @CurrentUser() user: User,
  ) {
    return await this.bookClient.send('get_borrowed_books', {
      userId: user._id,
      query,
    });
  }

  @CacheKey('GET_BORROWED_BOOK')
  @Get('get-borrowed-book/:borrowedBookId')
  async getBorrowedBook(@Param('borrowedBookId') borrowedBookId: string) {
    return await this.bookClient.send('get_borrowed_book', { borrowedBookId });
  }

  @Put('return-borrowed-book/:borrowedBookId')
  async returnBorrowedBook(
    @Param('borrowedBookId') borrowedBookId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('return_borrowed_book', {
      borrowedBookId,
      userId: user._id,
    });
  }

  @Put('approve-borrowed-book/:borrowedBookId')
  async approveReturnedBook(
    @Param('borrowedBookId') borrowedBookId: string,
    @CurrentUser() user: User,
    @Body() data: ApproveReturnedBookDto,
  ) {
    return this.bookClient.send('approve_borrowed_book', {
      borrowedBookId,
      userId: user._id,
      data,
    });
  }

  @CacheKey('GET_LEND_BOOKS')
  @ApiOperation({ description: 'Get Lend Books' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @Get('get-lend-books')
  async getLendBooks(
    @Query() query: QueryWithoutSearchDto,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('get_lend_books', { query, userId: user._id });
  }
}
