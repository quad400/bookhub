import { NestFactory } from '@nestjs/core';
import { HubServiceModule } from './hub-service.module';

async function bootstrap() {
  const app = await NestFactory.create(HubServiceModule);
  await app.listen(3000);
}
bootstrap();
