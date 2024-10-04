import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '../src/book/models/book.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
})
export class ModelModule {}
