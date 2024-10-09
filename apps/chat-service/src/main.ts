import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ChatServiceModule } from './chat-service.module';
import {
  CustomRpcExceptionFilter,
  HttpExceptions,
  ValidatorPipe,
  WsBaseException,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { RedisIoAdapter } from './chat/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(ChatServiceModule);

  app.useGlobalFilters(new CustomRpcExceptionFilter());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptions(httpAdapterHost));

  const configService = app.get(ConfigService);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  Logger.log(
    `Application is running with base url of localhost:${configService.get('PORT')}/api/v1`,
  );

  app.listen(3004)
}
bootstrap();
