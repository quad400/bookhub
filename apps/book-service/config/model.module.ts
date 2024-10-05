import {
  Book,
  BookSchema,
  Feedback,
  FeedbackSchema,
  History,
  HistorySchema,
  Profile,
  ProfileSchema,
  User,
  UserSchema,
} from '@app/common';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
})
export class ModelModule {}
