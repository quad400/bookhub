import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BOOK_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/book-service/.env',
    }),
  ],
  exports: [
    ConfigModule
  ]
})
export class BookConfigModule {}
