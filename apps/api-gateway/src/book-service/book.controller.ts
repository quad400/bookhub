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
  UserTypes,
} from '@app/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';

@UseInterceptors(CacheInterceptor)
@CacheTTL(30000)
@ApiTags('Book')
@Controller('books')
@ApiBearerAuth()
export class BookController {
  constructor(@Inject(BOOK_SERVICE) private bookClient: ClientProxy) {}

  @ApiOperation({ description: 'Create New Book' })
  @Post('create-book')
  async createBook(
    @CurrentUser() user: UserTypes,
    @Body() data: CreateBookDto,
  ) {
    return this.bookClient.send('create_book', {
      userId: user._id,
      data,
    });
  }

  // @ApiOperation({ description: 'Update Book' })
  // @ApiParam({ name: 'bookId' })
  // @Patch('update-book/:bookId')
  // async updateBook(
  //   @CurrentUser() user: UserTypes,
  //   @Param('bookId') bookId: string,
  //   @Body() data: UpdateBookDto,
  // ) {
  //   return await this.bookService.updateBook(user._id, bookId, data);
  // }

  // @CacheKey("GET_BOOK")
  // @ApiOperation({ description: 'Get Book by Id' })
  // @ApiParam({ name: 'bookId' })
  // @Get('get-book/:bookId')
  // async getBook(@Param('bookId') bookId: string) {
  //   return await this.bookService.getBook(bookId);
  // }

  // @CacheKey("GET_BOOKS")
  // @ApiOperation({ description: 'Get Books' })
  // @ApiQuery({
  //   name: 'page',
  //   description: 'Page Number',
  //   required: false,
  //   schema: { default: 1 },
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   description: 'Limit Number',
  //   required: false,
  //   schema: { default: 10 },
  // })
  // @ApiQuery({
  //   name: 'sortField',
  //   description: 'Field to sort',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'sortDirection',
  //   description: 'Direction To Sort ASC | DESC',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'searchField',
  //   description: 'Field Of Book to search',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'searchValue',
  //   description: 'Search Input',
  //   required: false,
  // })
  // @Get('get-books')
  // async getBooks(@Query() query: QueryDto) {
  //   return await this.bookService.getBooks(query);
  // }

  // @CacheKey("GET_MY_BOOKS")
  // @ApiOperation({ description: 'Get My Books' })
  // @ApiQuery({
  //   name: 'page',
  //   description: 'Page Number',
  //   required: false,
  //   schema: { default: 1 },
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   description: 'Limit Number',
  //   required: false,
  //   schema: { default: 10 },
  // })
  // @ApiQuery({
  //   name: 'sortField',
  //   description: 'Field to sort',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'sortDirection',
  //   description: 'Direction To Sort ASC | DESC',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'searchField',
  //   description: 'Field Of Book to search',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'searchValue',
  //   description: 'Search Input',
  //   required: false,
  // })
  // @Get('get-my-books')
  // async getMyBooks(@Query() query: QueryDto, @CurrentUser() user: UserTypes) {
  //   return await this.bookService.getMyBooks(query, user._id);
  // }

  // @ApiOperation({ description: 'Get Deleted Books' })
  // @ApiQuery({
  //   name: 'page',
  //   description: 'Page Number',
  //   required: false,
  //   schema: { default: 1 },
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   description: 'Limit Number',
  //   required: false,
  //   schema: { default: 10 },
  // })
  // @ApiQuery({
  //   name: 'sortField',
  //   description: 'Field to sort',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'sortDirection',
  //   description: 'Direction To Sort ASC | DESC',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'searchField',
  //   description: 'Field Of Book to search',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'searchValue',
  //   description: 'Search Input',
  //   required: false,
  // })
  // @Get('get-deleted-books')
  // async getDeletedBooks(@Query() query: QueryDto, @CurrentUser() user: UserTypes) {
  //   return await this.bookService.getDeletedBooks(query, user._id);
  // }

  // @ApiOperation({ description: 'Delete Book' })
  // @Delete('delete-book/:bookId')
  // async deleteBook(@Param('bookId') bookId: string, @CurrentUser() user: UserTypes) {
  //   return await this.bookService.deleteBook(user._id, bookId);
  // }

  // @ApiOperation({ description: 'Restore Book' })
  // @Put('restore-book/:bookId')
  // async restoreBook(@Param('bookId') bookId: string, @CurrentUser() user: UserTypes) {
  //   return await this.bookService.restoreBook(user._id, bookId);
  // }

  // @ApiOperation({ description: 'Archieved And UnArchieved Book' })
  // @Put('archieved-unarchieved-book/:bookId')
  // async toggleArchievedBook(@Param('bookId') bookId: string, @CurrentUser() user: UserTypes) {
  //   return await this.bookService.toggleArchievedBook(user._id, bookId);
  // }

  // @ApiOperation({ description: 'Share And UnShare Book' })
  // @Put('share-unshare-book/:bookId')
  // async toggleShareableBook(@Param('bookId') bookId: string, @CurrentUser() user: UserTypes) {
  //   return await this.bookService.toggleShareableBook(user._id, bookId);
  // }

  // @ApiOperation({ description: 'Delete Book Permanently' })
  // @Delete('delete-book-permanently/:bookId')
  // async deleteBookPermanently(@Param('bookId') bookId: string, @CurrentUser() user: UserTypes) {
  //   return await this.bookService.deleteBookPermanently(user._id, bookId);
  // }
}
