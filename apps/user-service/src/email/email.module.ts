import { Module } from '@nestjs/common';
import { EmailProcessor } from './email.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // MailerModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     transport: {
    //       host: configService.get('MAIL_HOST'),
    //       port: Number(configService.get('MAIL_PORT')),
    //       // service: configService.get(MAIL_SERVICE),
    //       secure: configService.get('MAIL_SECURE'),
    //       auth: {
    //         user: configService.get('MAIL_USERNAME'),
    //         pass: configService.get('MAIL_PASSWORD'),
    //       },
    //     },
    //     template: {
    //       dir: join(__dirname, 'templates'),
    //       adapter: new HandlebarsAdapter(),
    //     },
    //   }),
    // }),
  ],
  providers: [EmailProcessor],
})
export class EmailModule {}
