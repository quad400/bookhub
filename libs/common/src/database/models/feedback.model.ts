import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class Feedback extends AbstractDocument {
  @Prop({ type: String, ref: 'User', required: true })
  user: string;

  @Prop({ type: String, ref: 'Book', required: true })
  book: string;

  @Prop({ type: Number, max: 5, min: 1 })
  rate: number;

  @Prop({ type: String, maxlength: 225 })
  comment: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
