import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../abstract.schema';
import { HubProfile } from './hub-profile.model';

@Schema({ versionKey: false })
export class Hub extends AbstractDocument {
  @Prop({ type: String, ref: 'HubProfile' })
  hub_profile: string;

  @Prop({ type: String, ref: 'User', required: true })
  created_by: string;

  @Prop({ type: String, default: null })
  last_message: string;

  @Prop({ type: Date, default: null })
  last_message_at: Date;
}

export const HubSchema = SchemaFactory.createForClass(Hub);
