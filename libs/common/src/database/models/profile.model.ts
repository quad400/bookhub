import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../abstract.schema';

export type ProfileDocument = Profile & Document;

@Schema({ versionKey: false })
export class Profile extends AbstractDocument {
  @Prop({ type: Types.UUID, ref: 'User', required: true })
  user: string;

  @Prop({
    type: String,
    default:
      'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
  })
  avatar: string;

  @Prop({ type: String, default: null })
  fullname: string;

  @Prop({ type: String, default: null })
  bio: string;

  @Prop({ type: String, default: null })
  location: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
