import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  /**
   * Send an email.
   * @param mailOptions Object containing "from", "to", "subject" and 
   * optionally "text" properties. Other properties from ISendMailOptions
   * may be used.
   * @returns The sent message info.
   */
  async send(mailOptions: ISendMailOptions): Promise<SentMessageInfo> {
    const result = await this.mailerService.sendMail(mailOptions);
    return result;
  }
}
