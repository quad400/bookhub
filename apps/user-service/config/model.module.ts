import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../src/user/model/user.model";
import { Token, TokenSchema } from "../src/user/model/token.model";
import { Profile, ProfileSchema } from "../src/user/model/profile.model";


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class ModelModule {}