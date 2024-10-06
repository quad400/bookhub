import { Injectable } from '@nestjs/common';
import {
  BaseResponse,
  CreateBookDto,
  CustomError,
  RmqService,
  UpdateBookDto,
} from '@app/common';
import { BusinessCode } from '@app/common/enum';
import { QueryDto } from '@app/common';
import { BookRepository } from '../repos/book.repo';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private rmqService: RmqService,
    ) {}

  async createBook(userId: string, data: CreateBookDto, context: RmqContext) {
    try {

      await this.bookRepository.checkUnique(data, 'title');
      const book = await this.bookRepository.create({
        ...data,
        owner: userId,
      });
      await book.save();

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully created',
      });
    } catch (error: any) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async updateBook(
    userId: string,
    bookId: string,
    data: UpdateBookDto,
    context: RmqContext,
  ) {

    try {
      await this.bookRepository.checkUnique(data, 'title');

      await this.bookRepository.findOneAndUpdate(
        { owner: userId, _id: bookId },
        data,
      );

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully Updated',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getBook(bookId: string, context: RmqContext) {
    try {
      const book = await this.bookRepository.findById(bookId);
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully retrieved',
        data: book,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getBooks(query: QueryDto, context: RmqContext) {
    try {
      const books = await this.bookRepository.findPaginated({ query });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully retrieved',
        data: books,
      });
    } catch (error) {
      console.log(error);
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getMyBooks(query: QueryDto, userId: string, context: RmqContext) {
    try {
      const books = await this.bookRepository.findPaginated({
        query,
        filterQuery: { owner: userId },
      });
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully retrieved',
        data: books,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getDeletedBooks(query: QueryDto, userId: string, context: RmqContext) {
    try {
      const books = await this.bookRepository.findPaginated({
        query,
        filterQuery: { owner: userId, is_deleted: true },
      });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully retrieved',
        data: books,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async deleteBook(userId: string, bookId: string, context: RmqContext) {
    try {
      await this.bookRepository.softDelete({ owner: userId, _id: bookId });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully deleted',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async trashBook(userId: string, bookId: string, context: RmqContext) {
    try {
      await this.bookRepository.delete({ owner: userId, _id: bookId });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully deleted permanently',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async restoreBook(userId: string, bookId: string, context: RmqContext) {
    try {
      await this.bookRepository.restore({ owner: userId, _id: bookId });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully Restored',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async toggleArchievedBook(
    userId: string,
    bookId: string,
    context: RmqContext,
  ) {
    try {
      const book = await this.bookRepository.findOne({
        owner: userId,
        _id: bookId,
      });

      if (book.achieved) {
        await this.bookRepository.findOneAndUpdate(
          { owner: userId, _id: bookId },
          { achieved: false },
        );
        return BaseResponse.success({
          businessCode: BusinessCode.OK,
          businessDescription: 'Book Successfully UnArchieved Activated',
        });
      } else {
        await this.bookRepository.findOneAndUpdate(
          { owner: userId, _id: bookId },
          { achieved: true },
        );

        this.rmqService.ack(context);
        return BaseResponse.success({
          businessCode: BusinessCode.OK,
          businessDescription: 'Book Successfully Archieved Activated',
        });
      }
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async toggleShareableBook(
    userId: string,
    bookId: string,
    context: RmqContext,
  ) {
    try {
      const book = await this.bookRepository.findOne({
        owner: userId,
        _id: bookId,
      });

      if (book.shareable) {
        await this.bookRepository.findOneAndUpdate(
          { owner: userId, _id: bookId },
          { shareable: false },
        );
        return BaseResponse.success({
          businessCode: BusinessCode.OK,
          businessDescription: 'Book Successfully UnShareable Activated',
        });
      } else {
        await this.bookRepository.findOneAndUpdate(
          { owner: userId, _id: bookId },
          { shareable: true },
        );

        this.rmqService.ack(context);
        return BaseResponse.success({
          businessCode: BusinessCode.OK,
          businessDescription: 'Book Successfully Shareable Activated',
        });
      }
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }
}
