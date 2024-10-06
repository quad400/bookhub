import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentSchema,
  Hub,
  HubProfile,
  HubProfileSchema,
  HubSchema,
  Member,
  MemberSchema,
  Message,
  MessageSchema,
  User,
  UserSchema,
} from '@app/common';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hub.name, schema: HubSchema },
      { name: HubProfile.name, schema: HubProfileSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Member.name, schema: MemberSchema },
      { name: Attachment.name, schema: AttachmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: Message.name, schema: HubSchema }]),
  ],
})
export class ModelModule {}
