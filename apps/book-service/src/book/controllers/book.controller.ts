import { CreateBookDto, CurrentUser, QueryDto } from '@app/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BookService } from '../services/book.service';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @MessagePattern('create_book')
  async createBook(
    @Payload() data: { userId: string; data: CreateBookDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.createBook(data.userId, data.data, context);
  }

  // async updateBook(
  //   @CurrentUser() user: User,
  //   @Param('bookId') bookId: string,
  //   @Body() data: UpdateBookDto,
  // ) {
  //   return await this.bookService.updateBook(user._id, bookId, data);
  // }

  // async getBook(@Param('bookId') bookId: string) {
  //   return await this.bookService.getBook(bookId);
  // }

  // async getBooks(@Query() query: QueryDto) {
  //   return await this.bookService.getBooks(query);
  // }

  // async getMyBooks(@Query() query: QueryDto, @CurrentUser() user: User) {
  //   return await this.bookService.getMyBooks(query, user._id);
  // }

  // async getDeletedBooks(@Query() query: QueryDto, @CurrentUser() user: User) {
  //   return await this.bookService.getDeletedBooks(query, user._id);
  // }

  // async deleteBook(@Param('bookId') bookId: string, @CurrentUser() user: User) {
  //   return await this.bookService.deleteBook(user._id, bookId);
  // }

  // async restoreBook(@Param('bookId') bookId: string, @CurrentUser() user: User) {
  //   return await this.bookService.restoreBook(user._id, bookId);
  // }

  // async toggleArchievedBook(@Param('bookId') bookId: string, @CurrentUser() user: User) {
  //   return await this.bookService.toggleArchievedBook(user._id, bookId);
  // }

  // async toggleShareableBook(@Param('bookId') bookId: string, @CurrentUser() user: User) {
  //   return await this.bookService.toggleShareableBook(user._id, bookId);
  // }

  // async deleteBookPermanently(@Param('bookId') bookId: string, @CurrentUser() user: User) {
  //   return await this.bookService.deleteBookPermanently(user._id, bookId);
  // }
}
