import {
  CreateBookDto,
  QueryDto,
  UpdateBookDto,
} from '@app/common';
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

  @MessagePattern('update_book')
  async updateBook(
    @Payload() data: { userId: string; bookId: string; data: UpdateBookDto },
    @Ctx() context: RmqContext,
  ) {
    const { bookId, data: body, userId } = data;
    return await this.bookService.updateBook(userId, bookId, body, context);
  }

  @MessagePattern('get_book')
  async getBook(
    @Payload() data: { bookId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.getBook(data.bookId, context);
  }

  @MessagePattern('get_books')
  async getBooks(
    @Payload() data: { query: QueryDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.getBooks(data.query, context);
  }

  @MessagePattern('get_my_books')
  async getMyBooks(
    @Payload() data: { query: QueryDto; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.getMyBooks(data.query, data.userId, context);
  }

  @MessagePattern('get_deleted_books')
  async getDeletedBooks(
    @Payload() data: { query: QueryDto; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.getDeletedBooks(
      data.query,
      data.userId,
      context,
    );
  }

  @MessagePattern('delete_book')
  async deleteBook(
    @Payload() data: { bookId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.deleteBook(data.userId, data.bookId, context);
  }

  @MessagePattern('restore_book')
  async restoreBook(
    @Payload() data: { bookId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.restoreBook(
      data.userId,
      data.bookId,
      context,
    );
  }

  @MessagePattern('toggle_archieve_book')
  async toggleArchievedBook(
    @Payload() data: { bookId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.toggleArchievedBook(
      data.userId,
      data.bookId,
      context,
    );
  }

  @MessagePattern('toggle_share_book')
  async toggleShareableBook(
    @Payload() data: { bookId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.toggleShareableBook(
      data.userId,
      data.bookId,
      context,
    );
  }

  @MessagePattern('trash_book')
  async trashBook(
    @Payload() data: { bookId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.bookService.trashBook(data.userId, data.bookId, context);
  }
}
