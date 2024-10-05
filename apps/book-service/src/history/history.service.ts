import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HistoryRepository } from './repo/history.repo';
import { BookRepository } from '../book/repos/book.repo';
import {
  BaseResponse,
  CustomError,
  QueryDto,
  RmqService,
  USER_SERVICE,
} from '@app/common';
import { BusinessCode } from '@app/common/enum';
import { ApproveReturnedBookDto } from './dto/history.dto';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly bookRepository: BookRepository,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
    private rmqService: RmqService,
  ) {}

  async borrowBook(userId: string, bookId: string, context: RmqContext) {
    try {
      const user = await lastValueFrom(
        this.userClient.send('validate_user', { userId }),
      );

      if (user?.sucess === false) {
        throw new UnauthorizedException(user?.errors);
      }

      const book = await this.bookRepository.findOne(
        { _id: bookId, shareable: true, achieved: false },
        true,
      );

      if (!book) {
        throw new NotFoundException(
          'The book you are trying to borrow is not available at the momment',
        );
      }

      if (book.owner === userId) {
        throw new BadRequestException('You cannot borrow the book you own');
      }

      await this.historyRepository.create({
        borrower: user._id,
        book: book._id,
      });
      book.shareable = false;
      await book.save();

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'User successfully borrow book',
      });
    } catch (error: any) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getBorrowedBooks(userId: string, query: QueryDto, context: RmqContext) {
    try {
      const borrowedBooks = await this.historyRepository.findPaginated({
        query,
        filterQuery: { borrower: userId },
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'User successfully Retrieved borrow books',
        data: borrowedBooks,
      });
    } catch (error: any) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getBorrowedBook(borrowedBookId: string, context: RmqContext) {
    try {
      const borrowedBook = await (
        await (
          await this.historyRepository.findById(borrowedBookId)
        ).populate({
          path: 'borrower',
          select: 'username email profile',
        })
      ).populate({
        path: 'book',
        select:
          'title book_cover author synopsis isbn genre shareable achieved',
      });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'User successfully retrieved borrow book',
        data: borrowedBook,
      });
    } catch (error: any) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async returnBorrowedBook(
    borrowedBookId: string,
    userId: string,
    context: RmqContext,
  ) {
    try {
      const borrowedBook = await this.historyRepository.findOneAndUpdate(
        { _id: borrowedBookId, borrower: userId },
        { retured: true },
      );
      await this.bookRepository.findOneAndUpdate(
        { _id: borrowedBook.book },
        { shareable: true },
      );

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'User successfully return borrow book',
      });
    } catch (error: any) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async approveReturnedBook(
    borrowedBookId: string,
    userId: string,
    data: ApproveReturnedBookDto,
    context: RmqContext,
  ) {
    try {
      const borrowedBook = await this.historyRepository.findOne({
        _id: borrowedBookId,
      });
      const book = await this.bookRepository.findOne(
        { _id: borrowedBook.book, owner: userId },
        true,
      );

      if (!book) {
        throw new NotFoundException("You cannot approve book you don't own");
      }

      if (!borrowedBook.retured) {
        throw new BadRequestException(
          'You cannot approve book that has not been returned',
        );
      }

      borrowedBook.return_approved = true;
      borrowedBook.returned_condition = data.condition;

      await borrowedBook.save();

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'User successfully approved borrow book',
      });
    } catch (error: any) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getLendBooks(query: QueryDto, userId: string, context: RmqContext) {
    try {
      const books = await this.bookRepository.find({
        filterQuery: { owner: userId },
      });

      const bookIds = books.map((book) => book._id);

      if (!bookIds.length) {
        return [];
      }

      const historyResults = await this.historyRepository.findPaginated({
        query,
        filterQuery: { book: { $in: bookIds } },
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'User successfully retrieved lend books',
        data: historyResults,
      });
    } catch (error: any) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }
}
