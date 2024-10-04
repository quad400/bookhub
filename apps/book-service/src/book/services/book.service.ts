import { Inject, Injectable } from '@nestjs/common';
import {
  BaseResponse,
  BOOK_SERVICE,
  CreateBookDto,
  CustomError,
  RmqService,
  USER_SERVICE,
  UserTypes,
} from '@app/common';
import { BusinessCode } from '@app/common/enum';
import { QueryDto } from '@app/common';
import { BookRepository } from '../repos/book.repo';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RmqContext } from '@nestjs/microservices';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private rmqService: RmqService,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
  ) {}

  async createBook(userId: string, data: CreateBookDto, context: RmqContext) {
    try {
      
      this.userClient.send('validate_user', { userId });

      console.log('Herrrrr');
      await this.bookRepository.checkUnique(data, 'title');
      const book = await this.bookRepository.create({
        ...data,
        owner: userId,
      });
      console.log('Herrrrr.....');
      await book.save();

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Book Successfully created',
      });
    } catch (error: any) {
      console.log('Error.....');
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  // async updateBook(userId: string, bookId: string, data: UpdateBookDto) {
  //   await this.bookRepository.checkUnique(data, 'title');

  //   await this.bookRepository.findOneAndUpdate(
  //     { 'owner._id': userId, _id: bookId },
  //     data,
  //   );

  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully Updated',
  //   });
  // }

  // async getBook(bookId: string) {
  //   const book = await this.bookRepository.findById(bookId);
  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully retrieved',
  //     data: book,
  //   });
  // }

  // async getBooks(query: QueryDto) {
  //   const books = await this.bookRepository.findPaginated({ query });
  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully retrieved',
  //     data: books,
  //   });
  // }

  // async getMyBooks(query: QueryDto, userId: string) {
  //   console.log(userId)
  //   const books = await this.bookRepository.findPaginated({
  //     query,
  //     filterQuery: { 'owner._id': userId },
  //   });
  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully retrieved',
  //     data: books,
  //   });
  // }

  // async getDeletedBooks(query: QueryDto, userId: string) {
  //   const books = await this.bookRepository.findPaginated({
  //     query,
  //     filterQuery: { 'owner._id': userId, is_deleted: true },
  //   });
  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully retrieved',
  //     data: books,
  //   });
  // }

  // async deleteBook(userId: string, bookId: string) {
  //   await this.bookRepository.softDelete({ 'owner._id': userId, _id: bookId });
  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully deleted',
  //   });
  // }

  // async deleteBookPermanently(userId: string, bookId: string) {
  //   await this.bookRepository.delete({ 'owner._id': userId});
  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully deleted permanently',
  //   });
  // }

  // async restoreBook(userId: string, bookId: string) {
  //   await this.bookRepository.restore({ 'owner._id': userId, _id: bookId });
  //   return BaseResponse.success({
  //     businessCode: BusinessCode.OK,
  //     businessDescription: 'Book Successfully Restored',
  //   });
  // }

  // async toggleArchievedBook(userId: string, bookId: string) {
  //   const book = await this.bookRepository.findOne({
  //     'owner._id': userId,
  //     _id: bookId,
  //   });

  //   if (book.achieved) {
  //     await this.bookRepository.findOneAndUpdate(
  //       { 'owner._id': userId, _id: bookId },
  //       { achieved: false },
  //     );
  //     return BaseResponse.success({
  //       businessCode: BusinessCode.OK,
  //       businessDescription: 'Book Successfully UnArchieved Activated',
  //     });
  //   } else {
  //     await this.bookRepository.findOneAndUpdate(
  //       { 'owner._id': userId, _id: bookId },
  //       { achieved: true },
  //     );

  //     return BaseResponse.success({
  //       businessCode: BusinessCode.OK,
  //       businessDescription: 'Book Successfully Archieved Activated',
  //     });
  //   }
  // }

  // async toggleShareableBook(userId: string, bookId: string) {
  //   const book = await this.bookRepository.findOne({
  //     'owner._id': userId,
  //     _id: bookId,
  //   });

  //   if (book.shareable) {
  //     await this.bookRepository.findOneAndUpdate(
  //       { 'owner._id': userId, _id: bookId },
  //       { shareable: false },
  //     );
  //     return BaseResponse.success({
  //       businessCode: BusinessCode.OK,
  //       businessDescription: 'Book Successfully UnShareable Activated',
  //     });
  //   } else {
  //     await this.bookRepository.findOneAndUpdate(
  //       { 'owner._id': userId, _id: bookId },
  //       { shareable: true },
  //     );

  //     return BaseResponse.success({
  //       businessCode: BusinessCode.OK,
  //       businessDescription: 'Book Successfully Shareable Activated',
  //     });
  //   }
  // }
}
