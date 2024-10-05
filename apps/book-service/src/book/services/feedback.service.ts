import {
  AddFeedbackDto,
  BaseResponse,
  CustomError,
  QueryWithoutSearchDto,
  RmqService,
  UpdateFeedbackDto,
} from '@app/common';
import { FeedbackRepository } from '../repos/feedback.repo';
import { BusinessCode } from '@app/common/enum';
import { HistoryRepository } from '../../history/repo/history.repo';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly historyRepository: HistoryRepository,
    private rmqService: RmqService,
  ) {}

  async addFeedback(userId: string, data: AddFeedbackDto, context: RmqContext) {
    try {
      const { bookId, rate, comment } = data;
      console.log(userId)
      const history = await this.historyRepository.findOne(
        { book: bookId, borrower: userId },
        true,
      );

      if (!history) {
        throw new BadRequestException(
          'You have to borrow and read this book for you to give feedback',
        );
      }

      await this.feedbackRepository.create({
        user: userId,
        book: bookId,
        rate,
        comment,
      });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.CREATED,
        businessDescription: 'Feedback Successfully Added',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async updateFeedback(
    feedbackId: string,
    data: UpdateFeedbackDto,
    userId: string,
    context: RmqContext,
  ) {
    try {
      await this.feedbackRepository.findOneAndUpdate(
        { _id: feedbackId, user: userId },
        data,
      );

      return BaseResponse.success({
        businessCode: BusinessCode.CREATED,
        businessDescription: 'Feedback Successfully Updated',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getFeedback(feedbackId: string, context: RmqContext) {
    try {
      const feedback = await (
        await (
          await this.feedbackRepository.findById(feedbackId)
        ).populate({
          path: 'user',
          select: 'username email profile',
        })
      ).populate({
        path: 'book',
        select:
          'title book_cover author synopsis isbn genre shareable achieved',
      });

      return BaseResponse.success({
        businessCode: BusinessCode.CREATED,
        businessDescription: 'Feedback Successfully Retrieved',
        data: feedback,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getFeedbacks(
    query: QueryWithoutSearchDto,
    bookId: string,
    context: RmqContext,
  ) {
    try {
      const feedbacks = await this.feedbackRepository.findPaginated({
        query,
        filterQuery: { book: bookId },
      });

      return BaseResponse.success({
        businessCode: BusinessCode.CREATED,
        businessDescription: 'Feedbacks Successfully Retrieved',
        data: feedbacks,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }
}
