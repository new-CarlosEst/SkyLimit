import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { ContactDataDto } from './dto/contact-data.dto';

@Controller('mail')
export class MailController {
    constructor (private readonly mailService: MailService){}

    @Post('contact')
    @HttpCode(200)
    async sendContactEmail(@Body() contactDto: ContactDataDto) {
        return this.mailService.sendContactMail(contactDto);
    }
    
}
