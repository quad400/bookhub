import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class History extends AbstractDocument {
  @Prop({ type: String, ref: 'User', required: true })
  borrower: string;

  @Prop({ type: String, ref: 'Book', required: true })
  book: string;

  @Prop({ type: Boolean, default: false })
  retured: boolean;

  @Prop({ type: Boolean, default: false })
  return_approved: boolean;

  @Prop({ type: String, default: null })
  returned_condition: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
