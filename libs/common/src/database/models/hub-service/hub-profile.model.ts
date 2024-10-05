import { Prop, Schema } from '@nestjs/mongoose';
import { AbstractDocument } from '../../abstract.schema';

@Schema({ versionKey: false })
export class HubProfile extends AbstractDocument {
  @Prop({ type: String, maxlength: 100, required: true, unique: true })
  name: string;

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, ref: 'Hub', required: true })
  hub: string;
}
