import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import {
  CustomRpcExceptionFilter,
  HttpExceptions,
  RmqService,
  ValidatorPipe,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);

  app.useGlobalFilters(new CustomRpcExceptionFilter());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptions(httpAdapterHost));

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions("USER"));
  
  app.useGlobalPipes(ValidatorPipe());
  await app.startAllMicroservices();

}
bootstrap();
