import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../abstract.schema';
import { HubRoleEnum } from '@app/common/enum';

@Schema({ versionKey: false })
export class Member extends AbstractDocument {
  @Prop({ type: String, ref: 'User', required: true })
  user: string;

  @Prop({ type: String, ref: 'Hub', required: true })
  hub: string;

  @Prop({ enum: HubRoleEnum, default: HubRoleEnum.USER })
  role: string;

  @Prop({ type: Boolean, default: false })
  is_blocked: boolean;

  @Prop({ type: Date, default: Date.now() })
  joined_at: Date;
}


export const MemberSchema = SchemaFactory.createForClass(Member)