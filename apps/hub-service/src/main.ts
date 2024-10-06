import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HubServiceModule } from './hub-service.module';
import { CustomRpcExceptionFilter, HttpExceptions, HUB_SERVICE, RmqService, ValidatorPipe } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(HubServiceModule);
  
  
  app.useGlobalFilters(new CustomRpcExceptionFilter());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptions(httpAdapterHost));

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(HUB_SERVICE));
  
  app.useGlobalPipes(ValidatorPipe());
  await app.startAllMicroservices();
  
}
bootstrap();
