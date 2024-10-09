import { RmqModule, USER_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    RmqModule.register({ name: USER_SERVICE }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/chat-service/.env',
    }),

  ],
  exports: [
    RmqModule,
    ConfigModule
  ]
})
export class ChatConfigModule {}
