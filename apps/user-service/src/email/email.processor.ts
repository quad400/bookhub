import { MailProps, SEND_EMAIL_QUEUE } from '@app/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';


@Processor(SEND_EMAIL_QUEUE)
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('welcome')
  async sendWelcomeEmail(job: Job<MailProps>) {
    const { data } = job;
    console.log("Starting queue")
    await this.mailService.sendMail({
      to: data.to,
      from: "adedijiabdulquadri@gmail.com",
      subject: 'Welcome to Book Hub',
      template: 'welcome',
      context: {
        username: data.username,
        token: data.token,
      },
    });
    console.log("Ending queue")
  }

  @Process('resend-code')
  async resendCodeEmail(job: Job<MailProps>) {
    const { data } = job;
    console.log("Starting queue")
    await this.mailService.sendMail({
      to: data.to,
      from: "hello@demomailtrap.com",
      subject: 'Welcome to Book Hub',
      template: 'welcome',
      context: {
        username: data.username,
        token: data.token,
      },
    });
    console.log("Ending queue")
  }
}