import { Prop, Schema } from '@nestjs/mongoose';
import { AbstractDocument } from '../../abstract.schema';
import { Attachments } from './attachment.model';

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

  @Prop({ type: [Attachments], default: [] })
  attachements: Attachments[];
}
