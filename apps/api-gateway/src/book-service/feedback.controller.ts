import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
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
  AddFeedbackDto,
  BOOK_SERVICE,
  CurrentUser,
  QueryWithoutSearchDto,
  UpdateFeedbackDto,
  User,
} from '@app/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';

@UseInterceptors(CacheInterceptor)
@ApiTags('Feedback')
@ApiBearerAuth()
@Controller('feedbacks')
export class FeedbackController {
  constructor(@Inject(BOOK_SERVICE) private bookClient: ClientProxy) {}

  @ApiOperation({ description: 'Add New Feedback' })
  @Post('add-feedback')
  async addFeedback(@CurrentUser() user: User, @Body() data: AddFeedbackDto) {
    return this.bookClient.send('add_feedback', { userId: user._id, data });
  }

  @ApiOperation({ description: 'Update Feedback' })
  @Patch('update-feedback/:feedbackId')
  async updateFeedback(
    @CurrentUser() user: User,
    @Param('feedbackId') feedbackId: string,
    @Body() data: UpdateFeedbackDto,
  ) {
    return this.bookClient.send('update_feedback', {
      feedbackId,
      data,
      userId: user._id,
    });
  }

  @CacheKey('GET_FEEDBACK')
  @ApiOperation({ description: 'Get Feedback By Id' })
  @Get('get-feedback/:feedbackId')
  async getFeedback(@Param('feedbackId') feedbackId: string) {
    return this.bookClient.send('get_feedback', { feedbackId });
  }

  @CacheKey('GET_FEEDBACKS')
  @ApiOperation({ description: 'Get Feedbacks' })
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
  @Get('get-feedbacks/:bookId')
  async getFeedbacks(
    @Query() query: QueryWithoutSearchDto,
    @Param('bookId') bookId: string,
  ) {
    return this.bookClient.send('get_feedbacks', { query, bookId });
  }
}
