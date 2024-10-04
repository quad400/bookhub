import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomRpcExceptionFilter, HttpExceptions, ValidatorPipe } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(ValidatorPipe());

  app.setGlobalPrefix('api/v1');

  
  app.useGlobalFilters(new CustomRpcExceptionFilter());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptions(httpAdapterHost));

  const config = new DocumentBuilder()
    .setTitle('Book Social Network - User Service')
    .setDescription('Api for managing user profile and activities')
    .setVersion('1.0')
    .setContact(
      'Adediji Abdulquadri',
      'https://abdulquadri-portfolio.vercel.app/',
      'adedijiabdulquadri@gmail.com',
    )
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/api-docs', app, document, {
    explorer: true,
  });
  const configService = app.get(ConfigService)
  

  await app.listen(configService.get("PORT"), configService.get("HOST"));
  Logger.log(
    `Application is running with base url of localhost:${configService.get("PORT")}/api/v1`,
  );
}
bootstrap();
