import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profile.model';
import { AbstractDocument } from '../../abstract.schema';
import { UserRole } from '../../../enum/user.enum';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractDocument {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, unique: true, required: true })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Boolean, default: false })
  account_verified: boolean;

  @Prop({ type: Boolean, default: false })
  account_blocked: boolean;

  @Prop({ enum: UserRole, default: UserRole.READER })
  role: string;

  @Prop({ type: Profile })
  profile: Profile;

  @Prop({ type: String })
  socket_id: string;

  @Prop({ type: Boolean, default: false })
  is_online: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
