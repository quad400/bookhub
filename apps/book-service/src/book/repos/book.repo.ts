import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { Book } from '../models/book.model';

@Injectable()
export class BookRepository extends AbstractRepository<Book> {
  protected readonly logger = new Logger(BookRepository.name);

  constructor(
    @InjectModel(Book.name) bookModel: Model<Book>,
    @InjectConnection() connection: Connection,
  ) {
    super(bookModel, connection);
  }

  
}
