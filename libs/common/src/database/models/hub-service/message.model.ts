import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../abstract.schema';
import { Attachment } from './attachment.model';

@Schema({ versionKey: false, timestamps: true })
export class Message extends AbstractDocument {
  @Prop({ type: String, ref: 'Hub', required: true })
  hub: string;

  @Prop({ type: String, ref: 'Member', required: true })
  created_by: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String, ref: 'Message', default: null })
  replying_to: string;

  @Prop({ type: Boolean, default: false })
  is_reply: boolean;

  @Prop({ type: Boolean, default: false })
  is_edited: boolean;

  @Prop({ type: [Attachment], default: [] })
  attachements: Attachment[];
}


export const MessageSchema = SchemaFactory.createForClass(Message)