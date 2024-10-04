import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { BookServiceModule } from './book-service.module';
import { BOOK_SERVICE, CustomRpcExceptionFilter, HttpExceptions, RmqService, ValidatorPipe } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BookServiceModule);

  
  app.useGlobalFilters(new CustomRpcExceptionFilter());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptions(httpAdapterHost));

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(BOOK_SERVICE));
  
  app.useGlobalPipes(ValidatorPipe());
  await app.startAllMicroservices();
  
}
bootstrap();
