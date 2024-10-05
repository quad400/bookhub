import { Controller } from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { AddFeedbackDto, QueryWithoutSearchDto, UpdateFeedbackDto } from '@app/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @MessagePattern('add_feedback')
  async addFeedback(
    @Payload() data: { userId: string; data: AddFeedbackDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.feedbackService.addFeedback(
      data.userId,
      data.data,
      context,
    );
  }

  @MessagePattern('update_feedback')
  async updateFeedback(
    @Payload()
    data: { userId: string; data: UpdateFeedbackDto; feedbackId: string },
    @Ctx() context: RmqContext,
  ) {
    const { data: body, feedbackId, userId } = data;
    return await this.feedbackService.updateFeedback(
      feedbackId,
      body,
      userId,
      context,
    );
  }

  @MessagePattern('get_feedback')
  async getFeedback(
    @Payload() data: { feedbackId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.feedbackService.getFeedback(data.feedbackId, context);
  }

  @MessagePattern('get_feedbacks')
  async getFeedbacks(
    @Payload() data: { query: QueryWithoutSearchDto; bookId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.feedbackService.getFeedbacks(
      data.query,
      data.bookId,
      context,
    );
  }
}
