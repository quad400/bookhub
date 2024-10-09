import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  BOOK_SERVICE,
  CreateBookDto,
  CurrentUser,
  QueryDto,
  UpdateBookDto,
  User
} from '@app/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';

@UseInterceptors(CacheInterceptor)
@ApiTags('Book')
@Controller('books')
@ApiBearerAuth()
export class BookController {
  constructor(@Inject(BOOK_SERVICE) private bookClient: ClientProxy) {}

  @ApiOperation({ description: 'Create New Book' })
  @Post('create-book')
  async createBook(
    @CurrentUser() user: User,
    @Body() data: CreateBookDto,
  ) {
    return this.bookClient.send('create_book', {
      userId: user._id,
      data,
    });
  }

  @ApiOperation({ description: 'Update Book' })
  @ApiParam({ name: 'bookId' })
  @Patch('update-book/:bookId')
  async updateBook(
    @CurrentUser() user: User,
    @Param('bookId') bookId: string,
    @Body() data: UpdateBookDto,
  ) {
    return this.bookClient.send('update_book', {
      userId: user._id,
      bookId,
      data,
    });
  }

  @CacheKey('GET_BOOK')
  @ApiOperation({ description: 'Get Book by Id' })
  @ApiParam({ name: 'bookId' })
  @Get('get-book/:bookId')
  async getBook(@Param('bookId') bookId: string) {
    return this.bookClient.send('get_book', { bookId });
  }

  @CacheKey('GET_BOOKS')
  @ApiOperation({ description: 'Get Books' })
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
  @ApiQuery({
    name: 'searchField',
    description: 'Field Of Book to search',
    required: false,
  })
  @ApiQuery({
    name: 'searchValue',
    description: 'Search Input',
    required: false,
  })
  @Get('get-books')
  async getBooks(@Query() query: QueryDto) {
    return this.bookClient.send('get_books', { query });
  }

  @CacheKey('GET_MY_BOOKS')
  @ApiOperation({ description: 'Get My Books' })
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
  @ApiQuery({
    name: 'searchField',
    description: 'Field Of Book to search',
    required: false,
  })
  @ApiQuery({
    name: 'searchValue',
    description: 'Search Input',
    required: false,
  })
  @Get('get-my-books')
  async getMyBooks(@Query() query: QueryDto, @CurrentUser() user: User) {
    return this.bookClient.send('get_my_books', { query, userId: user._id });
  }

  @ApiOperation({ description: 'Get Deleted Books' })
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
  @ApiQuery({
    name: 'searchField',
    description: 'Field Of Book to search',
    required: false,
  })
  @ApiQuery({
    name: 'searchValue',
    description: 'Search Input',
    required: false,
  })
  @Get('get-deleted-books')
  async getDeletedBooks(
    @Query() query: QueryDto,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('get_deleted_books', {
      query,
      userId: user._id,
    });
  }

  @ApiOperation({ description: 'Delete Book' })
  @Delete('delete-book/:bookId')
  async deleteBook(
    @Param('bookId') bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('delete_book', { userId: user._id, bookId });
  }

  @ApiOperation({ description: 'Restore Book' })
  @Put('restore-book/:bookId')
  async restoreBook(
    @Param('bookId') bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('restore_book', { userId: user._id, bookId });
  }

  @ApiOperation({ description: 'Archieved And UnArchieved Book' })
  @Put('archieved-unarchieved-book/:bookId')
  async toggleArchievedBook(
    @Param('bookId') bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('toggle_archieve_book', {
      userId: user._id,
      bookId,
    });
  }

  @ApiOperation({ description: 'Share And UnShare Book' })
  @Put('share-unshare-book/:bookId')
  async toggleShareableBook(
    @Param('bookId') bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('toggle_share_book', {
      userId: user._id,
      bookId,
    });
  }

  @ApiOperation({ description: 'Delete Book Permanently' })
  @Delete('delete-book-permanently/:bookId')
  async deleteBookPermanently(
    @Param('bookId') bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookClient.send('trash_book', { userId: user._id, bookId });
  }
}
