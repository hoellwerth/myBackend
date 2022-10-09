import { MailService } from './services/mail.service';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

dotenv.config({
  path: 'src/environment/dev.env',
});

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mail.baumistlustig.eu',
        port: 8025,
        secure: false,
        auth: {
          user: 'noreply@mail.baumistlustig.eu',
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Baumistlustig" <noreply@baumistlustig.eu>',
      },
      template: {
        dir: join(__dirname, '../templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
